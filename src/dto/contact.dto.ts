import { Contact } from "../@core/models";
import { ParameterException } from "../@core/exceptions";

export class ContactDto {
    id: string;
    name: string;
    phone: string;
    address: string;
    notes: string;
    
    static toDto(toConvert: Contact): ContactDto {
        const result = new ContactDto();

        if (toConvert.id) {
            result.id = toConvert.id;
        } else {
            result.id = null;
        }

        if (toConvert.name) {
            result.name = toConvert.name;
        } else {
            result.name = null;
        }

        if (toConvert.phone) {
            result.phone = toConvert.phone;
        } else {
            result.phone = null;
        }

        if (toConvert.address) {
            result.address = toConvert.address;
        } else {
            result.address = null;
        }

        if (toConvert.notes) {
            result.notes = toConvert.notes;
        } else {
            result.notes = null;
        }

        
        return result;
    }
    
    static toModel(toConvert: ContactDto): Contact {
        const result = new Contact();
        toConvert.id && (result.id = toConvert.id);
        toConvert.name && (result.name = toConvert.name.trim());
        toConvert.phone && (result.phone = toConvert.phone.trim());
        toConvert.address && (result.address = toConvert.address.trim());
        toConvert.notes && (result.notes = toConvert.notes.trim());

        return result;
    }
}