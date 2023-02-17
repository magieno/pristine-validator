import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isAlphaValidator from "validator/lib/isAlpha";
import ValidatorJS from "validator";

export class IsAlphaValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly locale?: ValidatorJS.AlphaLocale, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isAlphaValidator(value, this.locale)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain only letters (a-zA-Z)",
            ConstraintErrorKeynameEnum.IsAlpha,
            value,
            property,
            target,
            metadata);
    }

    public getConstraints(): any {
        return {
            locale: this.locale,
        }
    }
}


// Decorator
export const isAlpha = (locale?: ValidatorJS.AlphaLocale, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsAlphaValidator(locale, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsAlpha = isAlpha;
