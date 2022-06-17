import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isIdentityCardValidator from 'validator/lib/isIdentityCard';
import ValidatorJS from 'validator';

export class IsIdentityCardValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly locale: ValidatorJS.IdentityCardLocale, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {

        if(typeof value === 'string' && isIdentityCardValidator(value, this.locale)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a identity card number",
            ConstraintErrorKeynameEnum.IsIdentityCard,
            value,
            property,
            target);
    }
}

// Decorator
/**
 * Check if the string is a valid identity card code.
 * locale is one of ['ES', 'zh-TW', 'he-IL', 'ar-TN'] OR 'any'. If 'any' is used, function will check if any of the locals match.
 * Defaults to 'any'.
 * If given value is not a string, then it returns false.
 */
export const $VALIDATOR_DECORATOR_NAME$ = (locale: ValidatorJS.IdentityCardLocale, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsIdentityCardValidator(locale, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsIdentityCard = $VALIDATOR_DECORATOR_NAME$;
