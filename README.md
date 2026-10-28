# pristine-validator

Since https://github.com/typestack/class-validator has not been recently updated, we have decided to fork it and transform the underlying code to be OOP.

The validators are staying the same but the validation mechanism has been re-written.

## JSON Schema

`JsonSchemaGenerator` turns a validated class into a JSON Schema (2020-12), so one class both
describes and validates a payload: an MCP tool input, a Prompt API tool, an API body.

```typescript
import {IsOptional, IsString, MaxLength, JsonSchemaGenerator, jsonSchema} from "@pristine-ts/class-validator";

class CreateTodoInput {
    @jsonSchema({description: "The title of the to-do."})
    @IsString()
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

new JsonSchemaGenerator().generate(CreateTodoInput);
// {
//   type: "object",
//   properties: {
//     title: {type: "string", maxLength: 200, description: "The title of the to-do."},
//     notes: {type: "string"},
//   },
//   required: ["title"],
//   additionalProperties: false,
// }
```

- A property is required unless it carries `@IsOptional()` or `@ValidateIf()`.
- Each validator gives its own keywords through `getJsonSchema()` (`@MaxLength` → `maxLength`,
  `@IsEmail` → `format: "email"`, `@IsEnum` → `enum`, ...). Without a type validator, the
  TypeScript design type gives the type; nested classes become nested objects.
- Two bounds of the same kind keep the strictest value, whatever the decorator order.
- A validator JSON Schema cannot express (`@IsPhoneNumber`, `@Custom`, ...) adds nothing: it still
  validates, but the schema is more permissive. `@jsonSchema({schema: {...}})` merges keywords last.
- A class that contains itself is refused.
