import {IsString} from "./validators/typechecker/is-string.validator";
import {Validator} from "./validator";
import {validateNested} from "./validators/validate-nested.validator";
import {isOptional} from "./conditions/is-optional.condition";
import { Max } from "./validators/number/max.validator";

describe("Validator", () => {
    it("should directly validate the first-level properties", async () => {
        class BasicClass {
            @IsString()
            // @ts-ignore
            title: string;
        }

        const object = new BasicClass();
        const validator = new Validator();
        const validationErrors = await validator.validate(object);

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].constraints).toBeDefined();
        expect(validationErrors[0].constraints["IS_STRING"]).toBeDefined();
        expect(validationErrors[0].target).toBe(object);
        expect(validationErrors[0].value).toBeUndefined()
        expect(validationErrors[0].property).toBe("title")
    });

    it("should properly validate the nested element and return properly nested validation errors", async () => {
        class NestedClass {
            @IsString()
            // @ts-ignore
            title: string;
        }

        class BasicClass {
            @validateNested()
            // @ts-ignore
            nestedClass: NestedClass;

            // @ts-ignore
            validMissingNumber: number;
        }

        const object = new BasicClass();
        object.nestedClass = new NestedClass();

        const validator = new Validator();
        const validationErrors = await validator.validate(object);

        expect(validationErrors.length).toBe(1);
        expect(Object.keys(validationErrors[0].constraints).length).toBe(0);
        expect(validationErrors[0].property).toBe("nestedClass")
        expect(validationErrors[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].property).toBe("title");
        expect(validationErrors[0].children[0].target).toBe(object.nestedClass);
        expect(validationErrors[0].children[0].value).toBeUndefined();
    })

    it("should not directly validate a nested element if there's no @nestedElement decorator", async () => {
        class NestedClass {
            @IsString()
                // @ts-ignore
            title: string;
        }

        class BasicClass {
                // @ts-ignore
            nestedClass: NestedClass;

            // @ts-ignore
            validMissingNumber: number;
        }

        const object = new BasicClass();
        object.nestedClass = new NestedClass();

        const validator = new Validator();
        const validationErrors = await validator.validate(object);

        expect(validationErrors.length).toBe(0);
    })

    it("should properly validate a nested array", async () => {
        class NestedClass {
            @IsString()
                // @ts-ignore
            title: string;
        }

        class BasicClass {
            @validateNested()
            nestedClasses: NestedClass[] = [];

            // @ts-ignore
            validMissingNumber: number;
        }

        const object = new BasicClass();
        const nestedClass1 = new NestedClass();
        const nestedClass2 = new NestedClass();
        nestedClass2.title = "Great title";
        const nestedClass3 = new NestedClass();
        object.nestedClasses.push(nestedClass1);
        object.nestedClasses.push(nestedClass2);
        object.nestedClasses.push(nestedClass3);

        const validator = new Validator();
        const validationErrors = await validator.validate(object);

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].children.length).toBe(2);
        expect(validationErrors[0].children[0].property).toBe("0");
        expect(validationErrors[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].children[0].property).toBe("title");
        expect(validationErrors[0].children[1].property).toBe("2");
        expect(validationErrors[0].children[1].children.length).toBe(1);
        expect(validationErrors[0].children[1].children[0].property).toBe("title");
    })

    it("should properly validate a nested array that has multiple checks", async () => {
        class NestedClass {
            @IsString()
            @Max(2)
                // @ts-ignore
            title;
        }

        class BasicClass {
            @validateNested()
            nestedClasses: NestedClass[] = [];

            // @ts-ignore
            validMissingNumber: number;
        }

        const object = new BasicClass();
        const nestedClass1 = new NestedClass();
        nestedClass1.title = 3;
        object.nestedClasses.push(nestedClass1);

        const validator = new Validator();
        const validationErrors = await validator.validate(object);

        console.log(JSON.stringify(validationErrors, null, 2));
        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].children.length).toBe(2);
        expect(validationErrors[0].children[0].property).toBe("0");
        expect(validationErrors[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].children[0].property).toBe("title");
        expect(validationErrors[0].children[1].property).toBe("2");
        expect(validationErrors[0].children[1].children.length).toBe(1);
        expect(validationErrors[0].children[1].children[0].property).toBe("title");
    })

    // Specific property paths
    it("should properly validate a property path without arrays (when other fields are invalid)", async () => {
        class NestedClass {
            @IsString()
            // @ts-ignore
            title: string;

            @IsString()
            // @ts-ignore
            description: string;
        }

        class BasicClass {
            @validateNested()
            // @ts-ignore
            nestedClass: NestedClass;

            @IsString()
            // @ts-ignore
            validMissingNumber: string;
        }

        const basicClass = new BasicClass();
        const nestedClass = new NestedClass();
        nestedClass.title = "Great title";
        basicClass.nestedClass = nestedClass;

        const validator = new Validator();
        const validationErrors = await validator.validate(basicClass, {
            propertyPath: "nestedClass.title"
        });

        expect(validationErrors.length).toBe(0);

        const validationErrors2 = await validator.validate(basicClass, {
            propertyPath: "nestedClass.description"
        });

        expect(validationErrors2.length).toBe(1);
        expect(validationErrors2[0].property).toBe("nestedClass");
        expect(validationErrors2[0].children.length).toBe(1);
        expect(validationErrors2[0].children[0].property).toBe("description");
        expect(validationErrors2[0].children[0].constraints.IS_STRING).toBeDefined();
    })

    // Validate array of objects
    it("should properly validate an array at the root", async () => {
        class NestedClass {
            @IsString()
                // @ts-ignore
            title: string;

            @IsString()
                // @ts-ignore
            description: string;
        }

        class BasicClass {
            @validateNested()
                // @ts-ignore
            nestedClass: NestedClass;

            @IsString()
                // @ts-ignore
            title: string;
        }

        const basicClassValid = new BasicClass();
        basicClassValid.title = "Valid title";
        basicClassValid.nestedClass = new NestedClass();
        basicClassValid.nestedClass.title = "title";
        basicClassValid.nestedClass.description = "description";

        const basicClassInvalid = new BasicClass();
        basicClassInvalid.nestedClass = new NestedClass();
        basicClassInvalid.nestedClass.title = "title";

        const validator = new Validator();
        const validationErrors = await validator.validate([basicClassValid, basicClassInvalid]);

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].property).toBe("1");
        expect(validationErrors[0].children.length).toBe(2);
        expect(validationErrors[0].children[0].property).toBe("nestedClass");
        expect(validationErrors[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].children[0].property).toBe("description");
        expect(validationErrors[0].children[0].children[0].constraints.IS_STRING).toBeDefined();

        expect(validationErrors[0].children[1].property).toBe("title");
    })

    // Conditional validators
    it("should not validate a property if it isn't present in the object and there is the @isOptional condition", async () => {
        class NestedClass {
            @IsString()
                // @ts-ignore
            title: string;

            @IsString()
            @isOptional()
                // @ts-ignore
            description: string;
        }

        class BasicClass {
            @validateNested()
                // @ts-ignore
            nestedClass: NestedClass;

            @IsString()
            @isOptional()
                // @ts-ignore
            title: string;
        }

        const basicClassInvalid = new BasicClass();
        basicClassInvalid.nestedClass = new NestedClass();
        basicClassInvalid.nestedClass.title = "title";

        const validator = new Validator();
        const validationErrors = await validator.validate(basicClassInvalid);

        expect(validationErrors.length).toBe(0);
    })

    it("should still validate a property if it's not undefined in the object, the @isOptional condition is present but the value is invalid", async () => {
        class NestedClass {
            @IsString()
                // @ts-ignore
            title: string;

            @IsString()
            @isOptional()
                // @ts-ignore
            description: string;
        }

        class BasicClass {
            @validateNested()
                // @ts-ignore
            nestedClass: NestedClass;

            @IsString()
                // @ts-ignore
            title: string;
        }

        const basicClassInvalid = new BasicClass();
        basicClassInvalid.nestedClass = new NestedClass();
        basicClassInvalid.nestedClass.title = "title";

        const validator = new Validator();
        const validationErrors = await validator.validate(basicClassInvalid);

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].property).toBe("title");
    })

    it("should properly validate the nested element and return properly nested validation errors when path is provided", async () => {
        class SubNestedClass {
            @IsString()
            // @ts-ignore
            subNestedTitle: string;
        }
        
        class NestedClass {
            @IsString()
            // @ts-ignore
            nestedTitle: string;

            @validateNested()
            // @ts-ignore
            subNested: SubNestedClass;
        }

        class BasicClass {
            @validateNested()
            // @ts-ignore
            nestedClass: NestedClass;

            // @ts-ignore
            validMissingNumber: number;
        }

        const basicClass = new BasicClass();
        basicClass.nestedClass = new NestedClass();
        basicClass.nestedClass.subNested = new SubNestedClass();

        const validator = new Validator();

        const validationErrors = await validator.validate(basicClass, {
            propertyPath: "nestedClass"
        });

        expect(validationErrors.length).toBe(1);
        expect(Object.keys(validationErrors[0].constraints).length).toBe(0);
        expect(validationErrors[0].property).toBe("nestedClass")
        expect(validationErrors[0].children.length).toBe(2);
        expect(validationErrors[0].children[0].property).toBe("nestedTitle");
        expect(validationErrors[0].children[0].target).toBe(basicClass.nestedClass);
        expect(validationErrors[0].children[0].value).toBeUndefined();
        expect(validationErrors[0].children[1].property).toBe("subNested");
        expect(Object.keys(validationErrors[0].children[1].constraints).length).toBe(0);
        expect(validationErrors[0].children[1].children.length).toBe(1);
        expect(validationErrors[0].children[1].children[0].property).toBe("subNestedTitle");
        expect(validationErrors[0].children[1].children[0].target).toBe(basicClass.nestedClass.subNested);
        expect(validationErrors[0].children[1].children[0].value).toBeUndefined();
    })
});
