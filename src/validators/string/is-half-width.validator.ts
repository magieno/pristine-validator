import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isHalfWidthValidator from "validator/lib/isHalfWidth";

/**
 * Checks if the string contains any half-width chars.
 * If given value is not a string, then it returns false.
 */
export class IsHalfWidthValidator extends BaseValidator implements ValidatorInterface {
    public constructor(validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isHalfWidthValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain a half-width characters",
            ConstraintErrorKeynameEnum.IsHalfWidth,
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
export const isHalfWidth = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsHalfWidthValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsHalfWidth = isHalfWidth;
