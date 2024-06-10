import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class MaxValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly maxNumber: number, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value > this.maxNumber) {
            return this.generateErrorMessage("'" + property + "' must not be greater than '" + this.maxNumber + "'",
                ConstraintErrorKeynameEnum.Max,
                value,
                property,
                target,
                this,
                metadata);
        }

        return null;
    }

    public getConstraints(): any {
        return {
            maxNumber: this.maxNumber,
        }
    }
}


// Decorator
export const max = (maxNumber: number, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new MaxValidator(maxNumber, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const Max = max;