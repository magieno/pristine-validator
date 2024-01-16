import {PropertyMetadata} from "@pristine-ts/metadata";
import {MetadataKeynameEnum} from "../enums/metadata-keyname.enum";

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
        PropertyMetadata.defineMetadata(target, propertyKey, MetadataKeynameEnum.ValidateNested, true);
    }
}

export const ValidateNested = validateNested;