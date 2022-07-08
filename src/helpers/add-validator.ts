import {ValidatorInterface} from "../interfaces/validator.interface";

export const addValidator = (target: any, propertyKey: string, instanciatedValidator: ValidatorInterface) => {
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

    if(target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey].hasOwnProperty("validators") === false) {
        target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey]["validators"] = []
    }

    target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey]["validators"].push(instanciatedValidator)
}
