import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLengthValidator from "validator/lib/isLength";

export class LengthValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly minLength: number, private readonly maxLength: number, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isLengthValidator(value, { min: this.minLength, max: this.maxLength })){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be longer than or equal to '" + this.minLength + "' and shorter than or equal to '" + this.maxLength + "' characters",
            ConstraintErrorKeynameEnum.Length,
            value,
            property,
            target,
            metadata);
    }
}


// Decorator
/**
 * Min length and max length must be specified. For only one limit see MinLength and MaxLength validators.
 * @param minLength
 * @param maxLength
 * @param buildErrorMessage
 */
export const length = (minLength: number, maxLength: number, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new LengthValidator(minLength, maxLength, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const Length = length;
