import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isBICValidator from "validator/lib/isBIC";

export class IsBICValidator extends BaseValidator implements ValidatorInterface {
    public constructor(validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isBICValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a BIC or SWIFT code",
            ConstraintErrorKeynameEnum.IsBIC,
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
export const isBIC = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsBICValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsBIC = isBIC;
