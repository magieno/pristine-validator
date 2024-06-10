import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isByteLengthValidator from "validator/lib/isByteLength";

export class IsByteLengthValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly minLength: number, private readonly maxLength: number, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isByteLengthValidator(value, {min: this.minLength, max: this.maxLength})) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' byte length must be longer than or equal to '" + this.minLength + "' and shorter than or equal to '" + this.maxLength + "' bytes",
            ConstraintErrorKeynameEnum.IsByteLength,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            minLength: this.minLength,
            maxLength: this.maxLength,
        }
    }
}


// Decorator
/**
 * Min length and max length must be specified.
 * @param minLength
 * @param maxLength
 * @param options
 */
export const isByteLength = (minLength: number, maxLength: number, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsByteLengthValidator(minLength, maxLength, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsByteLength = isByteLength;
