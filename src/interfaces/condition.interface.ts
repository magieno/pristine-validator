export interface ConditionInterface {
    shouldBeValidated(value: any, propertyKey: string, target: any, root: any, currentPath?: string): boolean
}
