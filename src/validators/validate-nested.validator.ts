import {PropertyMetadata} from "@pristine-ts/metadata";
import {MetadataKeynameEnum} from "../enums/metadata-keyname.enum";
import {ValidationOptionsInterface} from "../interfaces/validation-options.interface";

export const validateNested = (validationOptions?: ValidationOptionsInterface) => {
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
        PropertyMetadata.defineMetadata(target, propertyKey, MetadataKeynameEnum.ValidateNested, validationOptions ?? {});
    }
}

export const ValidateNested = validateNested;