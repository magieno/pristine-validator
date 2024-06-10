import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isVariableWidthValidator from 'validator/lib/isVariableWidth';

export class IsVariableWidthValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isVariableWidthValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain a full-width and half-width characters",
            ConstraintErrorKeynameEnum.IsVariableWidth,
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
export const isVariableWidth = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsVariableWidthValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsVariableWidth = isVariableWidth;
