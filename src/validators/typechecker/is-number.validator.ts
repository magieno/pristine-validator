import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

/**
 * Options to be passed to IsNumber decorator.
 */
export interface IsNumberOptions {
    allowNaN?: boolean;
    allowInfinity?: boolean;
    maxDecimalPlaces?: number;
}

export class IsNumberValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly numberOptions?: IsNumberOptions, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(metadata === undefined) {
            metadata = {};
        }

        metadata.errorContext = {
            type: typeof value,
        };

        const errorMessage = this.generateErrorMessage("'" + property + "' must be a number conforming to the specified constraints.",
            ConstraintErrorKeynameEnum.IsNumber,
            value,
            property,
            target,
            this,
            metadata);

        if (typeof value !== 'number') {
            return errorMessage;
        }

        if (value === Infinity || value === -Infinity) {
            return this.numberOptions?.allowInfinity ? null : errorMessage;
        }

        if (Number.isNaN(value)) {
            return this.numberOptions?.allowNaN ? null : errorMessage;
        }

        if (this.numberOptions?.maxDecimalPlaces !== undefined) {
            let decimalPlaces = 0;
            if (value % 1 !== 0) {
                decimalPlaces = value.toString().split('.')[1].length;
            }
            if (decimalPlaces > this.numberOptions.maxDecimalPlaces) {
                return errorMessage;
            }
        }

        if (Number.isFinite(value) === false) {
            return errorMessage;
        }

        return null;
    }

    public getConstraints(): any {
        return {
            numberOptions: this.numberOptions,
        }
    }
}

// Decorator
export const isNumber = (numberOptions?: IsNumberOptions, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsNumberValidator(numberOptions, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsNumber = isNumber;
