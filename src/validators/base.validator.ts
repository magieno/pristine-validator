import {ErrorMessage} from "../types/error-message.type";
import {BuildErrorMessageType} from "../types/build-error-message.type";

export abstract class BaseValidator {
    constructor(protected readonly buildErrorMessage?: BuildErrorMessageType) {
    }

    generateErrorMessage(defaultMessage: string, constraintName: string, value: any, propertyKey: string, target: any): ErrorMessage {
        if(this.buildErrorMessage === undefined) {
            return defaultMessage;
        }

        return this.buildErrorMessage(constraintName, value, propertyKey, target);
    }
}