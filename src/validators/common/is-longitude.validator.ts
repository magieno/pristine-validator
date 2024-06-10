import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLatLongValidator from "validator/lib/isLatLong";

export class IsLongitudeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (isLatLongValidator(`0,${value}`) === false) {
            return this.generateErrorMessage("'" + property + "' must be a longitude string or number.",
                ConstraintErrorKeynameEnum.IsLongitude,
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
export const isLongitude = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsLongitudeValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsLongitude = isLongitude;