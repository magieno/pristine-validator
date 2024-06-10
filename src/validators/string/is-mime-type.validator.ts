import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isMimeTypeValidator from 'validator/lib/isMimeType';

export class IsMimeTypeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isMimeTypeValidator(value)) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("$ERROR_MESSAGE$",
            ConstraintErrorKeynameEnum.IsMimeType,
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
export const isMimeType = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsMimeTypeValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsMimeType = isMimeType;
