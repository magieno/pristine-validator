import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class EqualsValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly expectedValue: any, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(value !== this.expectedValue) {
            return this.generateErrorMessage("The value '" + value + "' at property '" + property + "' is not equal to expected value: '" + this.expectedValue + "'",
                ConstraintErrorKeynameEnum.Equals,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const equals = (expectedValue: any, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new EqualsValidator(expectedValue, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const Equals = equals;