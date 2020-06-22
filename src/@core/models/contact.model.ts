export class Contact {
    id: string;
    name: string;
    phone: string;
    address: string;
    notes: string;
    
    static build(val: Partial<Contact>): Contact {
        const result = new Contact();
        result.id = val.id;
        result.name = val.name;
        result.phone = val.phone;
        result.address = val.address;
        result.notes = val.notes;
        return result;
    }
}