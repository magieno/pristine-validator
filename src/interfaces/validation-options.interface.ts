import {BuildErrorMessageType} from "../types/build-error-message.type";

export interface ValidationOptionsInterface {
    buildErrorMessage?: BuildErrorMessageType;
    groups?: string[];
}