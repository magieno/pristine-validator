import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isEmailValidator from "validator/lib/isEmail";
import ValidatorJS from "validator";

export class IsEmailValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly emailValidationOptions?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isEmailValidator(value, this.emailValidationOptions)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be an email",
            ConstraintErrorKeynameEnum.IsEmail,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            emailValidationOptions: this.emailValidationOptions,
        }
    }
}


// Decorator
export const isEmail = (emailValidationOptions?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsEmailValidator(emailValidationOptions, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsEmail = isEmail;
