import {isString} from "./is-string.validator";
import {Validator} from "./validator";

describe("Validator", () => {
    it("should directly validate the first-level properties", async () => {
        class BasicClass {
            @isString()
            // @ts-ignore
            title: string;
        }

        const validator = new Validator();
        const validationErrors = await validator.validate(new BasicClass());

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].constraints).toBeDefined();
        expect(validationErrors[0].constraints["IS_STRING"]).toBeDefined();
    });

    it("should directly validate the first-level properties", () => {

    });

    it("should not directly validate a nested element if there's no @nestedElement decorator", () => {

    })

    it("should properly validate a property path withou arrays (when other fields are invalid)", () => {

    })

    it("should properly validate a nested array", () => {

    })

    it("should properly validate an array at the root", () => {

    })
});