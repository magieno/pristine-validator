import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import ValidatorJS from "validator";
import isDecimalValidator from "validator/lib/isDecimal";

export class IsDecimalValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsDecimalOptions, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isDecimalValidator(value, this.options)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' is not a valid decimal number",
            ConstraintErrorKeynameEnum.IsDecimal,
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
export const isDecimal = (options?: ValidatorJS.IsDecimalOptions, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsDecimalValidator(options, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDecimal = isDecimal;
