import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isFullWidthValidator from "validator/lib/isFullWidth";

/**
 * Checks if the string contains any full-width chars.
 * If given value is not a string, then it returns false.
 */
export class IsFullWidthValidator extends BaseValidator implements ValidatorInterface {
    public constructor(validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isFullWidthValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain a full-width characters",
            ConstraintErrorKeynameEnum.IsFullWidth,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isFullWidth = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsFullWidthValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsFullWidth = isFullWidth;
