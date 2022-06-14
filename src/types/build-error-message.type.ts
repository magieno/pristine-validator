import {ErrorMessage} from "./error-message.type";

export type BuildErrorMessageType = (constraintName: string, value: any, propertyKey: string, target: any) => ErrorMessage;