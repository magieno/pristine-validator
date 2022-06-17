import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLocaleValidator from 'validator/lib/isLocale';

export class IsLocaleValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isLocaleValidator(value)) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("'" + property + "' must be locale",
            ConstraintErrorKeynameEnum.IsLocale,
            value,
            property,
            target);
    }
}

// Decorator
export const isLocale = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsLocaleValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsLocale = isLocale;
