import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isJSONValidator from 'validator/lib/isJSON';

export class IsJSONValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isJSONValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a json string",
            ConstraintErrorKeynameEnum.IsJSON,
            value,
            property,
            target,
            metadata);
    }

    public getConstraints(): any {
        return {
        }
    }
}

// Decorator
export const isJSON = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsJSONValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsJSON = isJSON;
