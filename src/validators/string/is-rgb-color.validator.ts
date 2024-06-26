import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isRgbColorValidator from 'validator/lib/isRgbColor';

export class IsRgbColorValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly includePercentValues?: boolean, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isRgbColorValidator(value, this.includePercentValues)) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("$ERROR_MESSAGE$",
            ConstraintErrorKeynameEnum.IsRgbColor,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            includePercentValues: this.includePercentValues,
        }
    }
}


// Decorator
export const isRgbColor = (includePercentValues?: boolean, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsRgbColorValidator(includePercentValues, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsRgbColor = isRgbColor;
