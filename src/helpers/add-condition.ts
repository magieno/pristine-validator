import {ConditionInterface} from "../interfaces/condition.interface";
import {PropertyMetadata} from "@pristine-ts/metadata"

export const conditionMetadataKeyname = "@condition";

export const addCondition = (target: any, propertyKey: string, instanciatedConstraint: ConditionInterface) => {
    PropertyMetadata.appendToMetadata(target, propertyKey, conditionMetadataKeyname, instanciatedConstraint);
}
