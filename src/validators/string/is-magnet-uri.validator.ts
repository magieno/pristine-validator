import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isMagnetURIValidator from 'validator/lib/isMagnetURI';

export class IsMagnetUriValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isMagnetURIValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be magnet uri format",
            ConstraintErrorKeynameEnum.IsMagnetUri,
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
export const isMagnetUri = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsMagnetUriValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsMagnetUri = isMagnetUri;
