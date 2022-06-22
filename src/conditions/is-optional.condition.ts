import {ConditionInterface} from "../interfaces/condition.interface";
import {addCondition} from "../helpers/add-condition";

export class IsOptionalCondition implements ConditionInterface {
    constructor() {
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
        return target.hasOwnProperty(propertyKey);
    }
}

// Decorator
export const isOptional = () => {
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
        const isOptionalCondition = new IsOptionalCondition();

        addCondition(target, propertyKey, isOptionalCondition)
    }
}
