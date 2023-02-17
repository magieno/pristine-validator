import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isPortValidator from 'validator/lib/isPort';

export class IsPortValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isPortValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a port",
            ConstraintErrorKeynameEnum.IsPort,
            value,
            property,
            target,
            metadata);
    }
}


// Decorator
export const isPort = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsPortValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsPort = isPort;
