import {ValidationConstraintError} from "../types/validation-constraint-error.type";
import {ErrorMessage} from "../types/error-message.type";

export interface ValidatorInterface {
    /**
     * This method validates the value at the specified property. If the value is validated, return null. If it isn't validate, return the error message.
     * @param value
     * @param property
     * @param target
     */
    validate(value: any, property: string, target: any): Promise<ErrorMessage | null>;
}
