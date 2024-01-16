import {ValidatorInterface} from "../interfaces/validator.interface";
import {PropertyMetadata} from "@pristine-ts/metadata";

export const validatorMetadataKeyname = "@validator";

export const addValidator = (target: any, propertyKey: string, instanciatedValidator: ValidatorInterface) => {
    PropertyMetadata.appendToMetadata(target, propertyKey, validatorMetadataKeyname, instanciatedValidator);
}
