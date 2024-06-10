import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isBase32Validator from "validator/lib/isBase32";

export class IsBase32Validator extends BaseValidator implements ValidatorInterface {
    public constructor(validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isBase32Validator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be base32 encoded",
            ConstraintErrorKeynameEnum.IsBase32,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isBase32 = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsBase32Validator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsBase32 = isBase32;
