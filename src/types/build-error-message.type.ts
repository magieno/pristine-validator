import {ErrorMessage} from "./error-message.type";
import {ConstraintErrorKeynameEnum} from "../enums/constraint-error-keyname.enum";

export type BuildErrorMessageType = (constraintKeyname: ConstraintErrorKeynameEnum, value: any, propertyKey: string, target: any, constraints: any, metadata?: any) => ErrorMessage;