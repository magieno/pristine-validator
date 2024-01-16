import {ValidatorInterface} from "../interfaces/validator.interface";
import {PropertyMetadata} from "@pristine-ts/metadata";
import {MetadataKeynameEnum} from "../enums/metadata-keyname.enum";

export const addValidator = (target: any, propertyKey: string, instanciatedValidator: ValidatorInterface) => {
    PropertyMetadata.appendToMetadata(target, propertyKey, MetadataKeynameEnum.Validator, instanciatedValidator);
}
