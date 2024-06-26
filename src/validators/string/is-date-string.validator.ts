import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import ValidatorJS from "validator";
import {IsISO8601Validator} from "./is-ISO-8601.validator";

export class IsDateStringValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsISO8601Options, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string') {
            const validator = new IsISO8601Validator(this.options);
            const validation = await validator.validate(value, property, target, metadata);
            if (validation === null) {
                return null;
            }
        }

        return this.generateErrorMessage("'" + property + "' must be a valid ISO 8601 date string",
            ConstraintErrorKeynameEnum.IsDateString,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            options: this.options,
        }
    }
}


// Decorator
export const isDateString = (options?: ValidatorJS.IsISO8601Options, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsDateStringValidator(options, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDateString = isDateString;
