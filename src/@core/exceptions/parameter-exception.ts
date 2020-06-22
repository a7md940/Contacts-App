import { BaseException } from "./base-exception";

export class ParameterException extends BaseException {
    code = 'PARMERR00x9'
    constructor(message: string, parameters: string[],  type?: string, code?: string) {
        super(message, type);
        if (code) {
            this.code = code;
        }
    }
}