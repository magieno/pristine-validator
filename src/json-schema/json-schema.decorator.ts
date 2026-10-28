import {PropertyMetadata} from "@pristine-ts/metadata";
import {MetadataKeynameEnum} from "../enums/metadata-keyname.enum";
import {JsonSchemaOptionsInterface} from "../interfaces/json-schema-options.interface";

/**
 * Documents a property for `JsonSchemaGenerator`. The type, the constraints and whether the
 * property is required come from the validation decorators; this decorator adds what they cannot
 * say, such as a description.
 *
 * ```ts
 * class CreateTodoInput {
 *     @jsonSchema({description: "The title of the to-do."})
 *     @IsString()
 *     @MaxLength(200)
 *     title: string;
 * }
 * ```
 */
export const jsonSchema = (options: JsonSchemaOptionsInterface) => {
    return (
        /**
         * The class on which the decorator is used.
         */
        target: any,
        /**
         * The property on which the decorator is used.
         */
        propertyKey: string,
    ) => {
        PropertyMetadata.defineMetadata(target, propertyKey, MetadataKeynameEnum.JsonSchema, options);
        PropertyMetadata.propertySeen(target, propertyKey);
    }
}

export const JsonSchema = jsonSchema;
