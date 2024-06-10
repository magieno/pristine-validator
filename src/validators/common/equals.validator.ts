import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class EqualsValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly expectedValue: any, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value !== this.expectedValue) {
            return this.generateErrorMessage("The value '" + value + "' at property '" + property + "' is not equal to expected value: '" + this.expectedValue + "'",
                ConstraintErrorKeynameEnum.Equals,
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
            expectedValue: this.expectedValue,
        }
    }
}


// Decorator
export const equals = (expectedValue: any, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new EqualsValidator(expectedValue, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const Equals = equals;