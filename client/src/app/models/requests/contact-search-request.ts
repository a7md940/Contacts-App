import { Contact } from '../contact.model';
import { ExactSearch } from '../exact-search.model';
import { PAGE_INDEX, PAGE_SIZE } from '../pagination.contants';

export class ContactSearchRequest {
    pageIndex = PAGE_INDEX;
    pageSize = PAGE_SIZE;
    desc = true;
    orderBy: keyof Contact = 'name';

    name: ExactSearch;
    phone: ExactSearch;

    address: string;
    notes: string;
}