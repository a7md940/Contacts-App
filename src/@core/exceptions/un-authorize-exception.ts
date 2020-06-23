import { BaseException } from "./base-exception";

export class UnauthorizeException extends BaseException {
    code = 'UNATH401'
    constructor(message: string, type?: string, code?: string) {
        super(message, type);
        if (code) {
            this.code = code;
        }
    }
}