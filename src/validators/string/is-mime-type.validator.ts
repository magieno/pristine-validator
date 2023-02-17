import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isMimeTypeValidator from 'validator/lib/isMimeType';

export class IsMimeTypeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isMimeTypeValidator(value)) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("$ERROR_MESSAGE$",
            ConstraintErrorKeynameEnum.IsMimeType,
            value,
            property,
            target,
            metadata);
    }
}

// Decorator
export const isMimeType = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsMimeTypeValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsMimeType = isMimeType;
