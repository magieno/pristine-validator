import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsDateValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(value instanceof Date && !isNaN(value.getTime())) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a Date instance.",
            ConstraintErrorKeynameEnum.IsDate,
            value,
            property,
            target);
    }
}

// Decorator
export const isDate = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsDateValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDate = isDate;
