import {ConditionInterface} from "../interfaces/condition.interface";
import {addCondition} from "../helpers/add-condition";
import {ValidationOptionsInterface} from "../interfaces/validation-options.interface";

export class ValidateIfCondition implements ConditionInterface {
    constructor(private readonly condition: (object: any, root?: any, currentPath?: string) => boolean, private readonly validationOptions?: ValidationOptionsInterface) {
    }

    shouldBeValidated(value: any, propertyKey: string, target: any, root: any, currentPath?: string): boolean {
        return this.condition(target, root, currentPath);
    }

    getValidationOptions(): ValidationOptionsInterface | undefined {
        return this.validationOptions;
    }
}


// Decorator
export const validateIf = (condition: (object: any, root?: any, currentPath?: string) => boolean, validationOptions?: ValidationOptionsInterface) => {
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
        const validateIfCondition = new ValidateIfCondition(condition, validationOptions);

        addCondition(target, propertyKey, validateIfCondition)
    }
}

export const ValidateIf = validateIf;
