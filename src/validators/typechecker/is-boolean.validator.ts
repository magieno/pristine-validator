import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsBooleanValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value !== 'boolean') {
            return this.generateErrorMessage("'" + property + "' must be of type boolean.",
                ConstraintErrorKeynameEnum.IsBoolean,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const isBoolean = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsBooleanValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsBoolean = isBoolean;
