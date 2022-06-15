import {ErrorMessage} from "./error-message.type";
import {ConstraintErrorKeynameEnum} from "../enums/constraint-error-keyname.enum";

export type BuildErrorMessageType = (constraintKeyame: ConstraintErrorKeynameEnum, value: any, propertyKey: string, target: any) => ErrorMessage;