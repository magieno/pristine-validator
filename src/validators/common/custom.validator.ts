import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {property} from "@pristine-ts/metadata";

export class CustomValidator implements ValidatorInterface {
    constructor(private readonly validationFunction: (value: any, property: string, target: any, metadata?: any) => Promise<ErrorMessage | null>, private readonly validationOptions?: ValidationOptionsInterface) {
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        return this.validationFunction(value, property, target, metadata);
    }

    public getConstraints(): any {
        return {
            validationFunction: this.validationFunction,
        }
    }

    getValidationOptions(): ValidationOptionsInterface | undefined {
        return this.validationOptions;
    }
}

// Decorator
export const customValidator = (validationFunction: (value: any, property: string, target: any) => Promise<ErrorMessage | null>, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new CustomValidator(validationFunction, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

// Compatibility with class-validator
export const Validate = customValidator;