import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class MinValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly minNumber: number, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value < this.minNumber) {
            return this.generateErrorMessage("'" + property + "' must not be less than '" + this.minNumber + "'",
                ConstraintErrorKeynameEnum.Min,
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
            minNumber: this.minNumber,
        }
    }
}


// Decorator
export const min = (minNumber: number, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new MinValidator(minNumber, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const Min = min;