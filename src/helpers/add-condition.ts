import {ConditionInterface} from "../interfaces/condition.interface";

export const addCondition = (target: any, propertyKey: string, instanciatedConstraint: ConditionInterface) => {
    if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
        target.constructor.prototype["__metadata__"] = {}
    }

    if(target.constructor.prototype["__metadata__"].hasOwnProperty("properties") === false) {
        target.constructor.prototype["__metadata__"]["properties"] = {}
    }

    if(target.constructor.prototype["__metadata__"]["properties"].hasOwnProperty(propertyKey) === false) {
        target.constructor.prototype["__metadata__"]["properties"][propertyKey] = {}
    }

    if(target.constructor.prototype["__metadata__"]["properties"][propertyKey].hasOwnProperty("constraints") === false) {
        target.constructor.prototype["__metadata__"]["properties"][propertyKey]["constraints"] = []
    }

    target.constructor.prototype["__metadata__"]["properties"][propertyKey]["constraints"].push(instanciatedConstraint)
}
