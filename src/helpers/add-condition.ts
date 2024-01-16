import {ConditionInterface} from "../interfaces/condition.interface";
import {PrototypeMetadataUtils} from "../utils/prototype-metadata.utils";

export const conditionMetadataKeyname = "@condition";

export const addCondition = (target: any, propertyKey: string, instanciatedConstraint: ConditionInterface) => {
    PrototypeMetadataUtils.appendToMetadata(conditionMetadataKeyname, instanciatedConstraint, target, propertyKey);
}
