import { ContactRepository } from "../../presistence";
import { Contact } from "../models/contact.model";
import { ParameterException } from "../exceptions";
import { ContactSearchCriteria, RowsAndCount } from "../models";
import { MongooseFilterQuery, FilterQuery } from "mongoose";

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

}