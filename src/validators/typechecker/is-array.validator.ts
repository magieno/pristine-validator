import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsArrayValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(Array.isArray(value) === false) {
            return this.generateErrorMessage("'" + property + "' must be an array",
                ConstraintErrorKeynameEnum.IsArray,
                value,
                property,
            target,
            metadata);
        }

        return null;
    }

    public getConstraints(): any {
        return {
        }
    }
}

// Decorator
export const isArray = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsArrayValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsArray = isArray;
