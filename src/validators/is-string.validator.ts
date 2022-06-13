import {ValidatorInterface} from "../interfaces/validator.interface";
import {addValidator} from "../helpers/add-validator";
import {ErrorMessage} from "../types/error-message.type";

export class IsStringValidator implements ValidatorInterface {
    async validate(value: any, propertyKey: string, target: any): Promise<ErrorMessage | null> {
        if(value instanceof String || typeof value === 'string') {
            return null;
        }

        return "The value is not of type string. Type received: '" + typeof value+ "'."
    }

    getName(): string {
        return "IS_STRING";
    }
}


// Decorator
export const isString = () => {
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
        const isStringValidator = new IsStringValidator();

        addValidator(target, propertyKey, isStringValidator)
    }
}
