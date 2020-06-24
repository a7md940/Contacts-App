import { Request, Response, NextFunction } from 'express';

import { ContactService } from "../@core/services";
import { BaseController } from "./base-controller";
import { ParameterException, NotFoundException } from "../@core/exceptions";
import { ContactDto, ContactSearchCriteriaDto } from '../dto';
import { HttpStatusCode } from '../@utils';
import { PagedList, Contact } from '../@core/models';

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
            const contact = ContactDto.toModel(req.body);
            const createdContact = await this._contactService.createContact(contact);
            
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

    updateContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body || Object.keys(req.body).length == 0) {
                throw new ParameterException(
                    'You must provied some data to update',
                    ['contact'],
                    'errors.contact.updateContact.dataToUpdateIsMissing',
                    'Nmq001y'
                );
            }
            const updateContactRequestDto = req.body as ContactDto[] | ContactDto;
            let contactsToUpdate: Contact | Contact[];
            if (Array.isArray(updateContactRequestDto)) {
                contactsToUpdate = updateContactRequestDto.map(ContactDto.toModel);
            } else {
                contactsToUpdate = ContactDto.toModel(updateContactRequestDto);
            }

            const updateResult = await this._contactService.updateContact(contactsToUpdate);

            let responseDto;
            if (Array.isArray(updateResult)) {
                responseDto = updateResult.map(ContactDto.toDto);
            } else {
                responseDto = ContactDto.toDto(updateResult);
            }
            res.status(HttpStatusCode.Ok)
            .json(responseDto);

        } catch (exc) {
            if (exc instanceof NotFoundException) {
                this.throwNotFound(res, exc);
            } else {
                this.internalError(res, exc);
            }
        }
    }

    deleteContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleteContactsRequestDto = req.body as string[];
            const deletedCount = await this._contactService.deleteContact(deleteContactsRequestDto);

            res.status(HttpStatusCode.Ok)
            .json(deletedCount);

        } catch (exc) {
            if (exc instanceof ParameterException) {
                this.throwBadRequest(res, exc);
            } else if (exc instanceof NotFoundException) {
                this.throwNotFound(res, exc);
            } else {
                this.internalError(res, exc);
            }
        }
    }
}