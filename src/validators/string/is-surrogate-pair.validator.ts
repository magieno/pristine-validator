import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isSurrogatePairValidator from 'validator/lib/isSurrogatePair';

export class IsSurrogatePairValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isSurrogatePairValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain any surrogate pairs chars",
            ConstraintErrorKeynameEnum.IsSurrogatePair,
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
export const isSurrogatePair = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsSurrogatePairValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsSurrogatePair = isSurrogatePair;
