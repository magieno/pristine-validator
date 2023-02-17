import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsEmptyValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(value !== '' && value !== null && value !== undefined) {
            return this.generateErrorMessage("The value '" + value + "' at property '" + property + "' is not empty.",
                ConstraintErrorKeynameEnum.IsEmpty,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const isEmpty = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsEmptyValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsEmpty = isEmpty;