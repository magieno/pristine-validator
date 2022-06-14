import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsPositiveValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(value < 0) {
            return this.generateErrorMessage("'" + value + "' must be a positive number.",
                ConstraintErrorKeynameEnum.IsPositive,
                value,
                property,
                target);
        }

        return null;
    }
}

// Decorator
export const isPositive = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsPositiveValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsPositive = isPositive;
