import {JsonSchemaInterface} from "./json-schema.interface";

/**
 * The options of the `@jsonSchema` decorator: what the validation decorators cannot say about a
 * property.
 */
export interface JsonSchemaOptionsInterface {
    /**
     * What the property means.
     */
    description?: string;

    /**
     * A short human-readable name.
     */
    title?: string;

    /**
     * Example values.
     */
    examples?: unknown[];

    /**
     * The value used when the property is absent. Informational only.
     */
    default?: unknown;

    /**
     * Keywords merged last into the generated schema of the property, for what validation cannot
     * express (the item type of an array of primitives, for example).
     */
    schema?: JsonSchemaInterface;
}
