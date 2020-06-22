import { ContactRepository } from "../../presistence";
import { Contact } from "../models/contact.model";
import { ParameterException } from "../exceptions";

export class ContactService {
    private _contactRepo = ContactRepository;
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