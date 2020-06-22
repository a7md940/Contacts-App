import { ExactSearchDto } from "./exact-search.dto";
import { Contact, ContactSearchCriteria } from "../@core/models";

export class ContactSearchCriteriaDto {
    pageIndex = 0;
    pageSize = 5;
    desc = true;
    orderBy: keyof Contact = 'name';

    name: ExactSearchDto;
    phone: ExactSearchDto;

    address: string;
    notes: string;
    
    static toModel(toConvert: ContactSearchCriteriaDto): ContactSearchCriteria {
        const result = new ContactSearchCriteria()
        result.pageIndex = toConvert.pageIndex;
        result.pageSize = toConvert.pageSize;
        result.desc = toConvert.desc;
        toConvert.orderBy && (result.orderBy = toConvert.orderBy);
    
        toConvert.name && (result.name = toConvert.name)
        toConvert.phone && (result.phone = toConvert.phone)
    
        toConvert.address && (result.address = toConvert.address)
        toConvert.notes && (result.notes = toConvert.notes)

        return result;
    }
}