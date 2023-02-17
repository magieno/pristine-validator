import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsDefinedValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(value === undefined || value === null) {
            return this.generateErrorMessage("The property '" + property + "' is not defined.",
                ConstraintErrorKeynameEnum.IsDefined,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const isDefined = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsDefinedValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDefined = isDefined;
