import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import {format} from 'date-fns'

export class MaxDateValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly maxDate: Date, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: Date, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(metadata === undefined) {
            metadata = {};
        }

        if (value instanceof Date === false) {
            metadata.errorContext = {
                type: typeof value,
            };

            return this.generateErrorMessage("The property '" + property + "' should be of 'Date' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.InvalidDate,
                value,
                property,
                target,
                this,
                metadata);
        }

        if (value.getTime() > this.maxDate.getTime()) {
            return this.generateErrorMessage("The property '" + property + "' must be prior to date + '" + format(this.maxDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") + "'",
                ConstraintErrorKeynameEnum.MaxDate,
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
            maxDate: this.maxDate,
        }
    }
}


// Decorator
export const maxDate = (maxDate: Date, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new MaxDateValidator(maxDate, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const MaxDate = maxDate;