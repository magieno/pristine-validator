import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isAlphaValidator from "validator/lib/isAlpha";
import ValidatorJS from "validator";

export class IsAlphaValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly locale?: ValidatorJS.AlphaLocale, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isAlphaValidator(value, this.locale)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain only letters (a-zA-Z)",
            ConstraintErrorKeynameEnum.IsAlpha,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            locale: this.locale,
        }
    }
}


// Decorator
export const isAlpha = (locale?: ValidatorJS.AlphaLocale, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsAlphaValidator(locale, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsAlpha = isAlpha;
