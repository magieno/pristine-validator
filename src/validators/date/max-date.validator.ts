import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import { format } from 'date-fns'

export class MaxDateValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly maxDate: Date, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: Date, property: string, target: any): Promise<ErrorMessage | null> {
        if (value instanceof Date === false) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Date' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.InvalidDate,
                value,
                property,
                target);
        }

        if(value.getTime() > this.maxDate.getTime()) {
            return this.generateErrorMessage("The property '" + property + "' must be prior to date + '" + format(this.maxDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")  + "'",
                ConstraintErrorKeynameEnum.MaxDate,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const maxDate = (maxDate: Date, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new MaxDateValidator(maxDate, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const MaxDate = maxDate;