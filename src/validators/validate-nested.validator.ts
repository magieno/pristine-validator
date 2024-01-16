import {addValidator} from "../helpers/add-validator";
import {IsStringValidator} from "./typechecker/is-string.validator";

export const validateNestedMetadataKeyname = "@validateNested";

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
        Reflect.defineMetadata(validateNestedMetadataKeyname, true, target.constructor, propertyKey);
    }
}

export const ValidateNested = validateNested;