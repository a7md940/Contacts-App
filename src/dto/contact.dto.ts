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

        result.id = toConvert.id;
        result.name = toConvert.name;
        result.phone = toConvert.phone;
        result.address = toConvert.address;
        result.notes = toConvert.notes;
        
        return result;
    }
    
    static toModel(toConvert: ContactDto): Contact {
        const result = new Contact();
        if (!toConvert.name) {
            throw new ParameterException('Missing contact name, name is required.', ['name']);
        }
        if (!toConvert.phone) {
            throw new ParameterException('Missing contact phone, phone is required.', ['phone']);
        }
        
        result.name = toConvert.name;
        result.phone = toConvert.phone;
        result.address = toConvert.address;
        result.notes = toConvert.notes;

        return result;
    }
}