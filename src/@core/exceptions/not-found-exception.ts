import { BaseException } from "./base-exception";

export class NotFoundException extends BaseException {
    code = 'NTFD404ERR';
    constructor(message: string, type?: string, code?: string) {
        super(message, type);
        if (code) {
            this.code = code;
        }
    }
}