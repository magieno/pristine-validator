import {ValidatorInterface} from "../interfaces/validator.interface";

export const addValidator = (target: any, propertyKey: string, instanciatedValidator: ValidatorInterface) => {
    if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
        target.constructor.prototype["__metadata__"] = {}
    }

    if(target.constructor.prototype["__metadata__"].hasOwnProperty("properties") === false) {
        target.constructor.prototype["__metadata__"]["properties"] = {}
    }

    if(target.constructor.prototype["__metadata__"]["properties"].hasOwnProperty(propertyKey) === false) {
        target.constructor.prototype["__metadata__"]["properties"][propertyKey] = {}
    }

    if(target.constructor.prototype["__metadata__"]["properties"][propertyKey].hasOwnProperty("validators") === false) {
        target.constructor.prototype["__metadata__"]["properties"][propertyKey]["validators"] = []
    }

    target.constructor.prototype["__metadata__"]["properties"][propertyKey]["validators"].push(instanciatedValidator)
}
