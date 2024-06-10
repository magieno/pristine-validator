import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isAlphanumericValidator from "validator/lib/isAlphanumeric";
import ValidatorJS from "validator";

export class IsAlphanumericValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly locale?: ValidatorJS.AlphanumericLocale, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isAlphanumericValidator(value, this.locale)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain only letters and numbers",
            ConstraintErrorKeynameEnum.IsAlphanumeric,
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
export const isAlphanumeric = (locale?: ValidatorJS.AlphanumericLocale, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsAlphanumericValidator(locale, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsAlphanumeric = isAlphanumeric;
