import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsObjectValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(metadata === undefined) {
            metadata = {};
        }

        if (value != null && (typeof value === 'object' || typeof value === 'function') && !Array.isArray(value)) {
            return null;
        }

        metadata.errorContext = {
            type: typeof value,
        };

        // todo: Error message
        return this.generateErrorMessage("'" + property + "' must be an object.",
            ConstraintErrorKeynameEnum.IsObject,
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
export const isObject = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsObjectValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsObject = isObject;
