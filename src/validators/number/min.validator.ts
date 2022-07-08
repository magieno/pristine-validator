import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class MinValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly minNumber: number, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(value < this.minNumber) {
            return this.generateErrorMessage("'" + property + "' must not be less than '" + this.minNumber + "'",
                ConstraintErrorKeynameEnum.Min,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const min = (minNumber: number, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new MinValidator(minNumber, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const Min = min;