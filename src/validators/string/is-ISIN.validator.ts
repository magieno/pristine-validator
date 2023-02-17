import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isIsinValidator from 'validator/lib/isISIN';

export class IsISINValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isIsinValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("$ERROR_MESSAGE$",
            ConstraintErrorKeynameEnum.IsISIN,
            value,
            property,
            target,
            metadata);
    }
}

// Decorator
export const isISIN = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsISINValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsISIN = isISIN;