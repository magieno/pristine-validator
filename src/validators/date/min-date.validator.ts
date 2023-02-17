import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import {format} from 'date-fns'

export class MinDateValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly minDate: Date, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: Date, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value instanceof Date === false) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Date' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.InvalidDate,
                value,
                property,
                target,
                this,
                metadata);
        }

        if (value.getTime() < this.minDate.getTime()) {
            return this.generateErrorMessage("The property '" + property + "' must be after date + '" + format(this.minDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") + "'",
                ConstraintErrorKeynameEnum.MinDate,
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
            minDate: this.minDate
        }
    }
}


// Decorator
export const minDate = (minDate: Date, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new MinDateValidator(minDate, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const MinDate = minDate;
