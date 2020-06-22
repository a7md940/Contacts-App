import { ExactSearch } from "./exact-search.model";
import { Contact } from "./contact.model";

export class ContactSearchCriteria {
    pageIndex = 0;
    pageSize = 5;
    desc = true;
    orderBy: keyof Contact = 'name';

    name: ExactSearch;
    phone: ExactSearch;

    address: string;
    notes: string;
}