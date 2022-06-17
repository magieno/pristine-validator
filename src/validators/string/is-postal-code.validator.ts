import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isPostalCodeValidator from 'validator/lib/isPostalCode';
import ValidatorJS from 'validator';

export class IsPostalCodeValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly locale: 'any' | ValidatorJS.PostalCodeLocale, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if( typeof value === 'string' && isPostalCodeValidator(value, this.locale)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a postal code",
            ConstraintErrorKeynameEnum.IsPostalCode,
            value,
            property,
            target);
    }
}


// Decorator
/**
 * Check if the string is a postal code,
 * (locale is one of [ 'AD', 'AT', 'AU', 'BE', 'BG', 'BR', 'CA', 'CH', 'CZ', 'DE', 'DK', 'DZ', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'ID', 'IE' 'IL', 'IN', 'IR', 'IS', 'IT', 'JP', 'KE', 'LI', 'LT', 'LU', 'LV', 'MT', 'MX', 'NL', 'NO', 'NZ', 'PL', 'PR', 'PT', 'RO', 'RU', 'SA', 'SE', 'SI', 'TN', 'TW', 'UA', 'US', 'ZA', 'ZM' ] OR 'any'. If 'any' is used, function will check if any of the locals match. Locale list is validator.isPostalCodeLocales.).
 * If given value is not a string, then it returns false.
 */
export const isPostalCode = (locale: 'any' | ValidatorJS.PostalCodeLocale, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsPostalCodeValidator(locale, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsPostalCode = isPostalCode;
