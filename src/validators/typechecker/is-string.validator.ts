import {ValidatorInterface} from "../../interfaces/validator.interface";
import {addValidator} from "../../helpers/add-validator";
import {ErrorMessage} from "../../types/error-message.type";
import {BaseValidator} from "../base.validator";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsStringValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, propertyKey: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(metadata === undefined) {
            metadata = {};
        }

        if (value instanceof String || typeof value === 'string') {
            return null;
        }

        metadata.errorContext = {
            type: typeof value,
        };

        return this.generateErrorMessage("The value is not of type string. Type received: '" + typeof value + "'.",
            ConstraintErrorKeynameEnum.IsString,
            value,
            propertyKey,
            target,
            this,
            metadata);
    }

    getName(): string {
        return "IS_STRING";
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isString = (validationOptions?: ValidationOptionsInterface) => {
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
        const isStringValidator = new IsStringValidator(validationOptions);

        addValidator(target, propertyKey, isStringValidator)
    }
}

export const IsString = isString;
