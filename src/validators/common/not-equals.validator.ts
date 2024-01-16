import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class NotEqualsValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly expectedValue: any, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value === this.expectedValue) {
            return this.generateErrorMessage("The value '" + value + "' at property '" + property + "' should not equal value: '" + this.expectedValue + "'",
                ConstraintErrorKeynameEnum.NotEquals,
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
export const notEquals = (expectedValue: any, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new NotEqualsValidator(expectedValue, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const NotEquals = notEquals;