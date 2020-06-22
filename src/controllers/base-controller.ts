import { Response } from 'express';
import { HttpStatusCode } from '../@utils';

export class BaseController {
    throwBadRequest(res: Response, exc: any) {
        res.status(HttpStatusCode.BadRequest)
        .json(exc);
    }

    internalError(res: Response, exc: any) {
        console.error(exc);
        res.status(HttpStatusCode.InternalError)
        .json(exc);
    }
}