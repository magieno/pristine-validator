import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLengthValidator from "validator/lib/isLength";

export class MinLengthValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly minLength: number, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isLengthValidator(value, {min: this.minLength})) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be longer than or equal to '" + this.minLength + "' characters",
            ConstraintErrorKeynameEnum.MinLength,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            minLength: this.minLength,
        }
    }
}


// Decorator
export const minLength = (minLength: number, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new MinLengthValidator(minLength, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const MinLength = minLength;

