import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isIso8601Validator from 'validator/lib/isISO8601';
import ValidatorJS from 'validator';

export class IsISO8601Validator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsISO8601Options, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isIso8601Validator(value, this.options)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a valid ISO 8601 date string",
            ConstraintErrorKeynameEnum.IsISO8601,
            value,
            property,
            target,
            metadata);
    }
}

// Decorator
export const isISO8601 = (options?: ValidatorJS.IsISO8601Options, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsISO8601Validator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsISO8601 = isISO8601;
