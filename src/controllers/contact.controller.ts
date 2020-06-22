import { Request, Response, NextFunction } from 'express';

import { ContactService } from "../@core/services";
import { BaseController } from "./base-controller";
import { ParameterException } from "../@core/exceptions";
import { ContactDto, ContactSearchCriteriaDto } from '../dto';
import { HttpStatusCode } from '../@utils';
import { PagedList } from '../@core/models';

export class ContactController extends BaseController {
    private _contactService = new ContactService();

    constructor() {
        super();
    }

    searchInContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body) {
                throw new ParameterException(
                    'Invalid search criteria',
                    ['searchCriteria'],
                    'contact.search.searchCriteriaIsRequired'
                );
            }
            
            const searchCriteria = ContactSearchCriteriaDto.toModel(req.body); 
            const { rows, count } = await this._contactService.search(searchCriteria)
            const pagedList = PagedList.build<ContactDto>(
                rows.map(ContactDto.toDto),
                searchCriteria.pageIndex,
                searchCriteria.pageSize,
                count
            );
            res.json(pagedList);
        } catch (exc) {
            if (exc instanceof ParameterException) {
                this.throwBadRequest(res, exc);
            } else {
                this.internalError(res, exc);
            }
        }
    }

    createContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contactModel = ContactDto.toModel(req.body);
            const createdContact = await this._contactService.createContact(contactModel);
            
            res.status(HttpStatusCode.Ok)
            .json(createdContact);
        } catch (exc) {
            console.error(exc);
            if (exc instanceof ParameterException) {
                this.throwBadRequest(res, exc)
            }  else {
                this.internalError(res, exc);
            }
        }
    }
}