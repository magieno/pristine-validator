import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsIntValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(metadata === undefined) {
            metadata = {};
        }

        if (typeof value === 'number' && Number.isInteger(value)) {
            return null;
        }

        metadata.errorContext = {
            type: typeof value,
        };

        // todo: Error message
        return this.generateErrorMessage("'" + property + "' must be an integer number.",
            ConstraintErrorKeynameEnum.IsInt,
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
export const isInt = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsIntValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsInt = isInt;

