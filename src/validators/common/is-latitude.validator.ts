import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isLatLongValidator from "validator/lib/isLatLong";

export class IsLatitudeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: number | string, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (isLatLongValidator(`${value},0`) === false) {
            return this.generateErrorMessage("'" + property + "' must be a latitude string or number.",
                ConstraintErrorKeynameEnum.IsLatitude,
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
export const isLatitude = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsLatitudeValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsLatitude = isLatitude;