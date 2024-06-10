import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsNegativeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value > 0) {
            return this.generateErrorMessage("'" + value + "' must be a negative number.",
                ConstraintErrorKeynameEnum.IsNegative,
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
export const isNegative = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsNegativeValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsNegative = isNegative;
