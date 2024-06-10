import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isRFC3339Validator from 'validator/lib/isRFC3339';

export class IsRFC3339Validator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isRFC3339Validator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be RFC 3339 date",
            ConstraintErrorKeynameEnum.IsRFC3339,
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
export const isRFC3339 = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsRFC3339Validator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsRFC3339 = isRFC3339;
