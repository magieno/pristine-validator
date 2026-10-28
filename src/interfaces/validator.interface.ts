import {ErrorMessage} from "../types/error-message.type";
import {ValidationOptionsInterface} from "./validation-options.interface";
import {JsonSchemaInterface} from "./json-schema.interface";

export interface ValidatorInterface {
    /**
     * This method validates the value at the specified property. If the value is validated, return null. If it isn't validate, return the error message.
     * @param value
     * @param property
     * @param target
     * @param metadata
     */
    validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null>;

    /**
     * This method returns the constraints with their names and value.
     */
    getConstraints(): any;

    /**
     * Returns the validation options or undefined if none are set.
     */
    getValidationOptions(): ValidationOptionsInterface | undefined

    /**
     * Returns the JSON Schema keywords this validator stands for, when JSON Schema can express it.
     * `JsonSchemaGenerator` merges them into the schema of the property.
     */
    getJsonSchema?(): JsonSchemaInterface;
}
