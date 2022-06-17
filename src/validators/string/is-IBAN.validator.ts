import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isIBANValidator from 'validator/lib/isIBAN';

export class IsIBANValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isIBANValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be an IBAN",
            ConstraintErrorKeynameEnum.IsIBAN,
            value,
            property,
            target);
    }
}

// Decorator
export const isIBAN = (buildErrorMessage?: BuildErrorMessageType) => {
    return (
        /**
         * The class on which the decorator is used.
         */
        target: any,

        /**
         * The property on which the decorator is used.
         */
        propertyKey: string,
    ) => {
        const validator = new IsIBANValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsIBAN = isIBAN;
