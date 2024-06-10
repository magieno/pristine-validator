import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsEmptyValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (value !== '' && value !== null && value !== undefined) {
            return this.generateErrorMessage("The value '" + value + "' at property '" + property + "' is not empty.",
                ConstraintErrorKeynameEnum.IsEmpty,
                value,
                property,
                target,
                this,
                metadata);
        }

        return null;
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isEmpty = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsEmptyValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsEmpty = isEmpty;