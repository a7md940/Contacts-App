import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizeException } from '../@core/exceptions';
import { JWT_SECRET } from '../config';
import { User } from '../@core/models';
import { BaseController } from '../controllers/base-controller';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}
export class RequireAuthMiddleware extends BaseController {
    
    private _requireAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('hahaha')
            const token = req.headers.authorization || '';
            if (!token) {
                throw new UnauthorizeException(
                    'Token not provided'
                );
            }
            const payload = jwt.verify(token, JWT_SECRET) as User;
            req.currentUser = payload;
            next();
        } catch (exc) {
            if (exc instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizeException(
                    'Invalid token you are not authenticated.',
                    'errors.authentication.invalidToken'
                );
            } else {
                throw exc;
            }
        }
    };

    private _handleException = (): (req: Request, res: Response, next: NextFunction) => void => {
        console.log('handle exc')
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this._requireAuth(req, res, next)
            } catch (exc) {
                if (exc instanceof UnauthorizeException) {
                    this.throwUnauthorized(res, exc);
                } else {
                    this.internalError(res, exc);
                }
            }
        }
    }
    use = this._handleException
}