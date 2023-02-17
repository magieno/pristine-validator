import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isOctalValidator from 'validator/lib/isOctal';

export class IsOctalValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isOctalValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("$ERROR_MESSAGE$",
            ConstraintErrorKeynameEnum.IsOctal,
            value,
            property,
            target,
            metadata);
    }
}


// Decorator
export const isOctal = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsOctalValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsOctal = isOctal;
