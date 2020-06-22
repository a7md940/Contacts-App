import { Response } from 'express';
import { HttpStatusCode } from '../@utils';

export class BaseController {
    protected throwBadRequest(res: Response, exc: any) {
        res.status(HttpStatusCode.BadRequest)
        .json(exc);
    }

    protected throwNotFound(res: Response, exc: any) {
        res.status(HttpStatusCode.NotFound)
        .json(exc);
    }

    protected internalError(res: Response, exc: any) {
        console.error(exc);
        res.status(HttpStatusCode.InternalError)
        .json(exc);
    }
}