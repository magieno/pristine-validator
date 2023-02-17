import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isDivisibleByValidator from 'validator/lib/isDivisibleBy';

export class IsDivisibleByValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly numberToDivideBy: number, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (isDivisibleByValidator(String(value), this.numberToDivideBy) === false) {
            return this.generateErrorMessage("'" + property + "' must be divisible by '" + this.numberToDivideBy + "'",
                ConstraintErrorKeynameEnum.IsDivisibleBy,
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
            numberToDivideBy: this.numberToDivideBy,
        }
    }
}


// Decorator
export const isDivisibleBy = (numberToDivideBy: number, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsDivisibleByValidator(numberToDivideBy, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDivisibleBy = isDivisibleBy;