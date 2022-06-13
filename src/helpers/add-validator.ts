import {ValidatorInterface} from "../interfaces/validator.interface";

export const addValidator = (target: any, propertyKey: string, instanciatedValidator: ValidatorInterface) => {
    // Verify that the object target.constructor.prototype["__metadata__"]["methods"][propertyKey]["route"] exists or we create it.
    // This object is a convention defined by Pristine on where to save the route decorator information and is used in the router to retrieve that information.
    if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
        target.constructor.prototype["__metadata__"] = {}
    }

    if(target.constructor.prototype["__metadata__"].hasOwnProperty("validators") === false) {
        target.constructor.prototype["__metadata__"]["validators"] = {}
    }

    if(target.constructor.prototype["__metadata__"]["validators"].hasOwnProperty(propertyKey) === false) {
        target.constructor.prototype["__metadata__"]["validators"][propertyKey] = []
    }

    target.constructor.prototype["__metadata__"]["validators"][propertyKey].push(instanciatedValidator)
}
