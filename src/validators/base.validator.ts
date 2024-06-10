import {ErrorMessage} from "../types/error-message.type";
import {BuildErrorMessageType} from "../types/build-error-message.type";
import {ConstraintErrorKeynameEnum} from "../enums/constraint-error-keyname.enum";
import {ValidatorInterface} from "../interfaces/validator.interface";
import {ValidationOptionsInterface} from "../interfaces/validation-options.interface";

export abstract class BaseValidator {
    constructor(protected readonly validationOptions?: Partial<ValidationOptionsInterface>) {
    }

    generateErrorMessage(defaultMessage: string, constraintKeyname: ConstraintErrorKeynameEnum, value: any, propertyKey: string, target: any, validator: ValidatorInterface, metadata?: any): ErrorMessage {
        if (this.validationOptions?.buildErrorMessage === undefined) {
            return {
                keyname: constraintKeyname,
                message: defaultMessage,
            };
        }

        return this.validationOptions?.buildErrorMessage(constraintKeyname, value, propertyKey, target, validator.getConstraints(), metadata);
    }

    getValidationOptions(): ValidationOptionsInterface | undefined {
        return this.validationOptions;
    }
}