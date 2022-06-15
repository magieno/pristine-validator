import {addValidator} from "../helpers/add-validator";
import {IsStringValidator} from "./typechecker/is-string.validator";

export const validateNested = () => {
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
        if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
            target.constructor.prototype["__metadata__"] = {}
        }

        if(target.constructor.prototype["__metadata__"].hasOwnProperty("properties") === false) {
            target.constructor.prototype["__metadata__"]["properties"] = {}
        }

        if(target.constructor.prototype["__metadata__"]["properties"].hasOwnProperty(propertyKey) === false) {
            target.constructor.prototype["__metadata__"]["properties"][propertyKey] = {}
        }

        target.constructor.prototype["__metadata__"]["properties"][propertyKey].validateNested = true
    }
}
