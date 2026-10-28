import "reflect-metadata";
import {ClassMetadata, PropertyInformationEnum, PropertyMetadata} from "@pristine-ts/metadata";
import {MetadataKeynameEnum} from "../enums/metadata-keyname.enum";
import {JsonSchemaInterface} from "../interfaces/json-schema.interface";
import {JsonSchemaOptionsInterface} from "../interfaces/json-schema-options.interface";
import {ValidatorInterface} from "../interfaces/validator.interface";
import {IsOptionalCondition} from "../conditions/is-optional.condition";
import {ValidateIfCondition} from "../conditions/validate-if.condition";

/**
 * Builds a JSON Schema (2020-12) from a class decorated with validation decorators, so the same
 * class both describes and validates a payload (an MCP tool input, a Prompt API tool, an API body).
 *
 * - A property is listed when at least one decorator marks it. It is required unless it carries
 *   `@IsOptional()` or `@ValidateIf()`.
 * - Each validator contributes its own keywords through `getJsonSchema()`. When no validator gives
 *   a type, the TypeScript design type does. A nested class becomes a nested object schema, and the
 *   `design:arraymembertype` metadata (`@array(Type)` in `@pristine-ts/data-mapping-common`) gives
 *   the item schema of an array.
 * - Validators JSON Schema cannot express (`@IsPhoneNumber`, `@Custom`, ...) add nothing: the
 *   schema is then more permissive than the validation. `@jsonSchema({schema})` closes the gap.
 * - Objects are closed (`additionalProperties: false`). A class that contains itself is refused.
 */
export class JsonSchemaGenerator {
    /**
     * The keywords whose combination keeps the strictest value.
     */
    private static readonly LowerBounds = ["minLength", "minItems", "minimum", "minProperties"];
    private static readonly UpperBounds = ["maxLength", "maxItems", "maximum"];

    /**
     * Returns the object schema of a class.
     * @param classType
     */
    public generate(classType: Function): JsonSchemaInterface {
        return this.objectSchema(classType, []);
    }

    private objectSchema(classType: Function, ancestors: Function[]): JsonSchemaInterface {
        if (ancestors.includes(classType)) {
            throw new Error(`The class '${classType.name}' contains itself: it cannot be described as a JSON Schema.`);
        }

        const properties: { [property: string]: JsonSchemaInterface } = {};
        const required: string[] = [];

        for (const propertyKey of ClassMetadata.getInformation(classType).properties ?? []) {
            properties[propertyKey] = this.propertySchema(classType.prototype, propertyKey, [...ancestors, classType]);

            if (this.isRequired(classType.prototype, propertyKey)) {
                required.push(propertyKey);
            }
        }

        const schema: JsonSchemaInterface = {type: "object", properties};

        if (required.length > 0) {
            schema.required = required;
        }

        schema.additionalProperties = false;

        return schema;
    }

    private propertySchema(prototype: any, propertyKey: string, ancestors: Function[]): JsonSchemaInterface {
        const validators: ValidatorInterface[] = PropertyMetadata.getMetadata(prototype, propertyKey, MetadataKeynameEnum.Validator) ?? [];
        let schema: JsonSchemaInterface = {};

        for (const validator of validators) {
            if (validator.getJsonSchema !== undefined) {
                schema = this.merge(schema, validator.getJsonSchema());
            }
        }

        // The design type of `string | null` or of an interface is only `Object`: an explicit type
        // validator wins over it.
        if (schema.type === undefined && schema.enum === undefined && schema.const === undefined) {
            schema = {...this.designTypeSchema(Reflect.getMetadata(PropertyInformationEnum.Type, prototype, propertyKey), ancestors), ...schema};
        }

        if (schema.type === "array" && schema.items === undefined) {
            const arrayMemberType = PropertyMetadata.getMetadata(prototype, propertyKey, PropertyInformationEnum.ArrayMemberType);

            if (arrayMemberType !== undefined) {
                schema.items = this.designTypeSchema(arrayMemberType, ancestors);
            }
        }

        return this.applyOptions(schema, PropertyMetadata.getMetadata(prototype, propertyKey, MetadataKeynameEnum.JsonSchema));
    }

    private designTypeSchema(designType: any, ancestors: Function[]): JsonSchemaInterface {
        switch (designType) {
            case undefined:
            case Object:
                return {};
            case String:
                return {type: "string"};
            case Number:
                return {type: "number"};
            case Boolean:
                return {type: "boolean"};
            case Array:
                return {type: "array"};
            case Date:
                return {type: "string", format: "date-time"};
        }

        return typeof designType === "function" ? this.objectSchema(designType, ancestors) : {};
    }

    /**
     * Merges the keywords of one more validator. Two bounds of the same kind keep the strictest
     * (`@IsNotEmpty()` must not loosen `@MinLength(3)`); any other keyword is overwritten.
     */
    private merge(schema: JsonSchemaInterface, keywords: JsonSchemaInterface): JsonSchemaInterface {
        const merged: JsonSchemaInterface = {...schema};

        for (const [keyword, value] of Object.entries(keywords)) {
            const current = merged[keyword];

            if (typeof current === "number" && typeof value === "number" && JsonSchemaGenerator.LowerBounds.includes(keyword)) {
                merged[keyword] = Math.max(current, value);
            } else if (typeof current === "number" && typeof value === "number" && JsonSchemaGenerator.UpperBounds.includes(keyword)) {
                merged[keyword] = Math.min(current, value);
            } else {
                merged[keyword] = value;
            }
        }

        return merged;
    }

    private applyOptions(schema: JsonSchemaInterface, options: JsonSchemaOptionsInterface | undefined): JsonSchemaInterface {
        if (options === undefined) {
            return schema;
        }

        const annotated: JsonSchemaInterface = {...schema};

        if (options.title !== undefined) {
            annotated.title = options.title;
        }
        if (options.description !== undefined) {
            annotated.description = options.description;
        }
        if (options.examples !== undefined) {
            annotated.examples = options.examples;
        }
        if (options.default !== undefined) {
            annotated.default = options.default;
        }

        return {...annotated, ...options.schema};
    }

    private isRequired(prototype: any, propertyKey: string): boolean {
        const conditions: unknown[] = PropertyMetadata.getMetadata(prototype, propertyKey, MetadataKeynameEnum.Condition) ?? [];

        return conditions.some(condition => condition instanceof IsOptionalCondition || condition instanceof ValidateIfCondition) === false;
    }
}
