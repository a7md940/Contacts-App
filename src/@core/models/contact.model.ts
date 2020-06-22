export class Contact {
    /* Contact identifier */
    id: string;
    /* Contact name, max length is `50 char` */
    name: string;
    /* Contact phone, max length is `12 char` and must be numbers */
    phone: string;
    /* Contact address, max length is `200 char` */
    address: string;
    /* Contact notes, not required. */
    notes?: string;
    
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