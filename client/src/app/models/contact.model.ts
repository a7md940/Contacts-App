export class Contact {
    /** Contact identifier */
    id: string;
    /** Contact name `required field`*/
    name: string;  
    /** Contact Phone `required field` */
    phone: string;
    /** Contact address is a string describes the street flat... etc not the geolocation optional field */
    address?: string;
    /** Notes about this contact `optional field` */
    notes?: string;
}     