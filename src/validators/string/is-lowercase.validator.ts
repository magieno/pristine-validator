import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLowercaseValidator from 'validator/lib/isLowercase';

export class IsLowercaseValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isLowercaseValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a lowercase string",
            ConstraintErrorKeynameEnum.IsLowercase,
            value,
            property,
            target,
            metadata);
    }
}

// Decorator
export const isLowercase = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsLowercaseValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsLowercase = isLowercase;

