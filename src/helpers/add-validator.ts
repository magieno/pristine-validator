import {ValidatorInterface} from "../interfaces/validator.interface";
import {PrototypeMetadataUtils} from "../utils/prototype-metadata.utils";
export const validatorMetadataKeyname = "@validator";

export const addValidator = (target: any, propertyKey: string, instanciatedValidator: ValidatorInterface) => {
    PrototypeMetadataUtils.appendToMetadata(validatorMetadataKeyname, instanciatedValidator, target, propertyKey);
}
