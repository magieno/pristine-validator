import {ConditionInterface} from "../interfaces/condition.interface";
import {PropertyInformationEnum, PropertyMetadata} from "@pristine-ts/metadata"
import {MetadataKeynameEnum} from "../enums/metadata-keyname.enum";

export const addCondition = (target: any, propertyKey: string, instanciatedConstraint: ConditionInterface) => {
    PropertyMetadata.appendToMetadata(target, propertyKey, MetadataKeynameEnum.Condition, instanciatedConstraint);
    PropertyMetadata.defineMetadata(target, propertyKey, PropertyInformationEnum.Nullable, true);
}
