import {ConditionInterface} from "../interfaces/condition.interface";
import {addCondition} from "../helpers/add-condition";
import {ValidationOptionsInterface} from "../interfaces/validation-options.interface";

export class IsOptionalCondition implements ConditionInterface {
    constructor(private readonly validationOptions?: ValidationOptionsInterface) {
    }

    /**
     * This is very simple. If the target doesn't have the property, and this condition was added on the property,
     * then we don't want to validate. If the target has the property, then we validate. This is similar to simply calling
     * .hasOwnProperty on the target.
     * @param value
     * @param propertyKey
     * @param target
     * @param root
     */
    shouldBeValidated(value: any, propertyKey: string, target: any, root: any): boolean {
        return target.hasOwnProperty(propertyKey) && target[propertyKey] !== null && target[propertyKey] !== undefined;
    }

    getValidationOptions(): ValidationOptionsInterface | undefined {
        return this.validationOptions;
    }
}

// Decorator
export const isOptional = (validationOptions?: ValidationOptionsInterface) => {
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
        const isOptionalCondition = new IsOptionalCondition(validationOptions);

        addCondition(target, propertyKey, isOptionalCondition)
    }
}

export const IsOptional = isOptional;