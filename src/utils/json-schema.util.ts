import {JsonSchemaInterface} from "../interfaces/json-schema.interface";

export class JsonSchemaUtil {
    /**
     * Returns an `enum` schema, with a `type` when every value shares one.
     * @param values
     */
    public static enumSchema(values: unknown[]): JsonSchemaInterface {
        const schema: JsonSchemaInterface = {enum: [...values]};

        if (values.length > 0 && values.every(value => typeof value === "string")) {
            schema.type = "string";
        } else if (values.length > 0 && values.every(value => Number.isInteger(value))) {
            schema.type = "integer";
        } else if (values.length > 0 && values.every(value => typeof value === "number")) {
            schema.type = "number";
        }

        return schema;
    }
}
