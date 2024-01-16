import {ErrorMessage} from "../types/error-message.type";
import {BuildErrorMessageType} from "../types/build-error-message.type";
import {ConstraintErrorKeynameEnum} from "../enums/constraint-error-keyname.enum";
import {ValidatorInterface} from "../interfaces/validator.interface";

export abstract class BaseValidator {
    constructor(protected readonly buildErrorMessage?: BuildErrorMessageType) {
    }

    generateErrorMessage(defaultMessage: string, constraintKeyname: ConstraintErrorKeynameEnum, value: any, propertyKey: string, target: any, validator: ValidatorInterface, metadata?: any): ErrorMessage {
        if (this.buildErrorMessage === undefined) {
            return {
                keyname: constraintKeyname,
                message: defaultMessage,
            };
        }

        return this.buildErrorMessage(constraintKeyname, value, propertyKey, target, validator.getConstraints(), metadata);
    }
}