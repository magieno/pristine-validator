import {ValidatorInterface} from "../interfaces/validator.interface";
import {addValidator} from "../helpers/add-validator";

export class IsStringValidator implements ValidatorInterface {
    async validate(value: any, object: any, target: any): Promise<boolean> {
        return value instanceof String || typeof value === 'string';
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
