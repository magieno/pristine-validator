import {ErrorMessage} from "./error-message.type";

export type ValidationConstraintError = {
    [type: string]: ErrorMessage;
}
