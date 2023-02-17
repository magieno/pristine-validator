import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLengthValidator from "validator/lib/isLength";

export class MaxLengthValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly maxLength: number, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isLengthValidator(value, { max: this.maxLength })){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be longer than or equal to '" + this.maxLength + "' characters",
            ConstraintErrorKeynameEnum.MaxLength,
            value,
            property,
            target,
            metadata);
    }

    public getConstraints(): any {
        return {
            maxLength: this.maxLength,
        }
    }
}


// Decorator
export const maxLength = (maxLength: number, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new MaxLengthValidator(maxLength, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const MaxLength = maxLength;

