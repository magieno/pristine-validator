import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsNegativeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(value > 0) {
            return this.generateErrorMessage("'" + value + "' must be a negative number.",
                ConstraintErrorKeynameEnum.IsNegative,
                value,
                property,
            target,
            metadata);
        }

        return null;
    }
}

// Decorator
export const isNegative = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsNegativeValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsNegative = isNegative;
