import {ConditionInterface} from "../interfaces/condition.interface";

export const addCondition = (target: any, propertyKey: string, instanciatedConstraint: ConditionInterface) => {
    if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
        target.constructor.prototype["__metadata__"] = {}
    }

    if(target.constructor.prototype["__metadata__"].hasOwnProperty("class-validator") === false) {
        target.constructor.prototype["__metadata__"]["class-validator"] = {}
    }

    if(target.constructor.prototype["__metadata__"]["class-validator"].hasOwnProperty("properties") === false) {
        target.constructor.prototype["__metadata__"]["class-validator"]["properties"] = {}
    }

    if(target.constructor.prototype["__metadata__"]["class-validator"]["properties"].hasOwnProperty(propertyKey) === false) {
        target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey] = {}
    }

    if(target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey].hasOwnProperty("conditions") === false) {
        target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey]["conditions"] = []
    }

    target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey]["conditions"].push(instanciatedConstraint)
}
