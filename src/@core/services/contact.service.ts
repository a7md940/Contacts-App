import { ContactRepository } from "../../presistence";
import { Contact } from "../models/contact.model";
import { ParameterException, NotFoundException } from "../exceptions";
import { ContactSearchCriteria, RowsAndCount } from "../models";
import { MongooseFilterQuery, FilterQuery, isValidObjectId } from "mongoose";

export class ContactService {
    private _contactRepo = ContactRepository;

    /**
     * Search in contacts with some criteria
     * @param searchCriteria Contact search criteria to search by.
     * @returns {Promise<RowsAndCount<Contact>>} Promise of RowsAndCount<Contact>
     */
    search = async (searchCriteria: ContactSearchCriteria): Promise<RowsAndCount<Contact>> => {
        let { orderBy, desc, pageSize, pageIndex, address, notes, name, phone } = searchCriteria;

        const skip = pageIndex * pageSize;
        const $or: FilterQuery<Contact>[] = [];
        let $and: FilterQuery<Contact>[] = [];

        const query: MongooseFilterQuery<Contact> = {
            $or,
            $and
        };
        if (address && address.trim()) {
            address = address.trim();
            $or.push({ address: new RegExp(address, 'g') });
        }

        if (notes && notes.trim()) {
            notes = notes.trim();
            $or.push({ notes: new RegExp(notes, 'g') });
        }

        if (name && name.exact) {
            name.value = name.value.trim()
            $and.push({ name: name.value })
        } else if (name && !name.exact) {
            name.value = name.value.trim()
            $and.push({ name: new RegExp(name.value, 'g') })
        }
        if (phone && phone.exact) {
            phone.value = phone.value.trim()
            $and.push({ phone: phone.value })
        } else if (phone && !phone.exact) {
            phone.value = phone.value.trim()
            $and.push({ phone: new RegExp(phone.value, 'g') })
        }

        if (phone && phone.exact && name && name.exact) {
            $and = $and.filter(x => 'name' in x)
        }

        if ($or.length == 0) {
            delete query.$or;
        }
        if ($and.length == 0) {
            delete query.$and;
        }
        
        const contactsPromise = this._contactRepo.find(query)
        .sort({ [orderBy]: desc ? -1 : 1 })
        .limit(pageSize)
        .skip(skip)
        .then(x => x.map(Contact.build));

        const totalCountPromise = this._contactRepo.countDocuments(query)

        const [ contacts, totalCount ] = await Promise.all([contactsPromise, totalCountPromise]);
        return { rows: contacts.map(Contact.build), count: totalCount }
    }

    /**
     * Created a new contact.
     * @param contact Contact attributes to create.
     * @return {Promise<Contact>} Promise of new Contact.
     * @throws { ParameterException } This contact is already exists.
     */
    async createContact(contact: Contact): Promise<Contact> {
        try {
            const existingContact = await this._contactRepo.findOne({ name: { $eq: contact.name.trim() } })
            if (existingContact) {
                throw new ParameterException(
                    'Contact is already exists',
                    ['name'],
                    'contact.create.alreadyExist',
                    'DOUPx011Cc'
                );
            }

            const contactDoc = this._contactRepo.build(contact);
            const result =  await contactDoc.save();

            // Build contact model.
            const createdContact = new Contact();
            createdContact.id = result._id;
            createdContact.name = result.name;
            createdContact.phone = result.phone;
            createdContact.address = result.address;
            createdContact.notes = result.notes;

            return createdContact;
        } catch (exc) {
            throw exc;
        }
    }

    /**
     * Updates one/many contact/s.
     * @param contact Contact/s to update with there identifiers.
     * @returns {Promise<Contact | Contact[]>} Promise of updated Contact or Contact[]
     * @throws {NotFoundException} Contact/s not found to update
     */
    async updateContact(contact: Contact[] | Contact): Promise<Contact | Contact[]> {
        try {
            if (Array.isArray(contact) && contact.length > 1) {
                const contacts = contact;
                const contactsToUpdate = await this._contactRepo.find({ _id: { $in: contacts.map(x => x.id) } } );
                if (contactsToUpdate.length != contacts.length) {
                    throw new NotFoundException(
                        'Some contacts not found',
                        'error.contact.updateContact.someContactNotFound'
                    );
                }
                
                const updatedResult = await Promise.all(
                    contactsToUpdate.map(contact => contact
                        .update(contacts.find(c => c.id == contact._id))
                    )
                );

                return updatedResult;

            } else {
                if (Array.isArray(contact)) {
                    [contact] = contact;
                } else {
                    contact = contact;
                }
                const existingContact = await this._contactRepo.findById(contact.id);
                if (!existingContact) {
                    throw new NotFoundException(
                        'Contact not found',
                        'error.contact.updateContact.contactNotFound'
                    );
                }
    
                let allowUpdate = false;
                for (const key in contact) {
                    const prop = key as keyof Contact;
                    if (existingContact.get(key) != contact[prop]) {
                        allowUpdate = true;
                    }
                }
    
                if (allowUpdate) {
                    await existingContact.update(contact);
                    return Contact.build(contact);
                } else {
                    return Contact.build(existingContact);
                }
            }
        } catch (exc) {
            throw exc;
        }
    }

    /**
     * Deletes Contacts by there identifiers.
     * @param contactIds Contact identifiers array.
     * @returns {Promise<number>} Promise of the deleted count number.
     * @throws {ParameterException} `Invalid identifiers`
     */
    async deleteContact(contactIds: string[]): Promise<number> {
        try {
            if (!contactIds.every(id => isValidObjectId(id))) {
                throw new ParameterException(
                    'Invalid identifiers',
                    ['id']
                );
            }

            const existingContacts = await this._contactRepo.find({ _id: { $in: contactIds } })
            .select('_id');

            if (existingContacts.length != contactIds.length) {
                throw new NotFoundException(
                    'Some contacts not found',
                    'errors.contact.deleteContact.someContactsNotFound'
                );
            }

           const removeResult = await this._contactRepo.deleteMany({ _id: { $in: contactIds } });

           return removeResult.deletedCount;
        } catch (exc) {
            throw exc;
        }
    }

}