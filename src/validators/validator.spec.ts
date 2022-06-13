import {isString} from "./is-string.validator";
import {Validator} from "./validator";
import {validateNested} from "./validate-nested.validator";

describe("Validator", () => {
    it("should directly validate the first-level properties", async () => {
        class BasicClass {
            @isString()
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
            @isString()
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
            @isString()
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
            @isString()
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

    // Specific property paths
    it("should properly validate a property path without arrays (when other fields are invalid)", () => {

    })

    // Validate array of objects
    it("should properly validate an array at the root", () => {

    })
});