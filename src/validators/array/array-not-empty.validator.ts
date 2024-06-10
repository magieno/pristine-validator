import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class ArrayNotEmptyValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (!Array.isArray(value)) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Array' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.ArrayInvalid,
                value,
                property,
                target,
                this,
                metadata);
        }

        if (value.length === 0) {
            // todo: Error message
            return this.generateErrorMessage("The array at property '" + property + "' should not be empty.",
                ConstraintErrorKeynameEnum.ArrayNotEmpty,
                value,
                property,
                target,
                this,
                metadata);
        }

        return null;
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const arrayNotEmpty = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new ArrayNotEmptyValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const ArrayNotEmpty = arrayNotEmpty;