import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isISO31661Alpha2Validator from 'validator/lib/isISO31661Alpha2';

export class IsISO31661Alpha2Validator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isISO31661Alpha2Validator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a valid ISO31661 Alpha2 code",
            ConstraintErrorKeynameEnum.IsISO31661Alpha2,
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
export const isISO31661Alpha2 = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsISO31661Alpha2Validator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsISO31661Alpha2 = isISO31661Alpha2;
