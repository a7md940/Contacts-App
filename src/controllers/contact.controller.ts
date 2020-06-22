import { Request, Response, NextFunction } from 'express';

import { ContactService } from "../@core/services";
import { BaseController } from "./base-controller";
import { ParameterException } from "../@core/exceptions";
import { ContactDto } from '../dto';
import { HttpStatusCode } from '../@utils';

export class ContactController extends BaseController {
    constructor() {
        super();
    }
    private _contactService = new ContactService();

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