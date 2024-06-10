import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import {CountryCode, parsePhoneNumberFromString} from "libphonenumber-js";


export class IsPhoneNumberValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly countryCode?: CountryCode, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        try {
            const phoneNum = parsePhoneNumberFromString(value, this.countryCode);
            if (phoneNum?.isValid() === true) {
                return null
            }
        } catch (error) {
            // logging?
        }

        return this.generateErrorMessage("'" + property + "' must be a valid phone number",
            ConstraintErrorKeynameEnum.IsPhoneNumber,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            countryCode: this.countryCode,
        }
    }
}


// Decorator
/**
 * Checks if the string is a valid phone number. To successfully validate any phone number the text must include
 * the intl. calling code, if the calling code wont be provided then the region must be set.
 *
 * @param countryCode 2 characters uppercase country code (e.g. DE, US, CH) for country specific validation.
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 */
export const isPhoneNumber = (countryCode?: CountryCode, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsPhoneNumberValidator(countryCode, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsPhoneNumber = isPhoneNumber;
