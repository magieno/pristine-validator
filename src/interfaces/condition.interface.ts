import {ValidationOptionsInterface} from "./validation-options.interface";

export interface ConditionInterface {
    shouldBeValidated(value: any, propertyKey: string, target: any, root: any, currentPath?: string): boolean

    /**
     * Returns the validation options or undefined if none are set.
     */
    getValidationOptions(): ValidationOptionsInterface | undefined
}
