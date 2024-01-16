import {PropertyMetadata} from "@pristine-ts/metadata";

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
        PropertyMetadata.defineMetadata(target, propertyKey, validateNestedMetadataKeyname, true);
    }
}

export const ValidateNested = validateNested;