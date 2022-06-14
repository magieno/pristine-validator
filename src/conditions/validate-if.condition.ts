import {ConditionInterface} from "../interfaces/condition.interface";
import {addCondition} from "../helpers/add-condition";

export class ValidateIfCondition implements ConditionInterface {
    constructor(private readonly condition: (object: any, root?: any) => boolean) {
    }

    shouldBeValidated(value: any, propertyKey: string, target: any, root: any): boolean {
        return this.condition(target, root);
    }
}


// Decorator
export const validateIf = (condition: (object: any, root?: any) => boolean) => {
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
        const validateIfCondition = new ValidateIfCondition(condition);

        addCondition(target, propertyKey, validateIfCondition)
    }
}
