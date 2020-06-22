import mognoose, { Schema, Document, Model } from 'mongoose';
import { Contact } from '../../@core/models/contact.model';

interface UserModel extends Model<ContactDoc> {
    build(contact: Omit<Contact, 'id'>): ContactDoc;
}

interface ContactDoc extends Document {
    _id: string;
    name: string;
    phone: string;
    notes: string;
    address: string;
}

const contactSchema = new Schema<Contact>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
});

contactSchema.statics.build = (contact: Contact) => new ContactRepository(contact);

const ContactRepository = mognoose.model<ContactDoc, UserModel>('contact', contactSchema);

export { ContactRepository };