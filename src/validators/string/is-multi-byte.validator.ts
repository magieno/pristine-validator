import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isMultibyteValidator from 'validator/lib/isMultibyte';

export class IsMultiByteValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isMultibyteValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain one or more multibyte chars",
            ConstraintErrorKeynameEnum.IsMultiByte,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isMultiByte = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsMultiByteValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsMultiByte = isMultiByte;