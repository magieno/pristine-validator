import {IsString} from "./validators/typechecker/is-string.validator";
import {Validator} from "./validator";
import {validateNested} from "./validators/validate-nested.validator";
import {IsOptional, isOptional} from "./conditions/is-optional.condition";
import { Max } from "./validators/number/max.validator";
import { ValidateIf } from "./conditions/validate-if.condition";
import {customValidator} from "./validators/common/custom.validator";
import {ErrorMessage} from "./types/error-message.type";
import {isNotEmpty} from "./validators/common/is-not-empty.validator";
import {plainToInstance} from "class-transformer";
import {IsInt} from "./validators/typechecker/is-int.validator";

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

    it("should directly validate the first-level properties when the object is built using plainToInstance", async () => {
        class BasicClass {
            @IsString()
            // @ts-ignore
            title: string;
        }

        const object = plainToInstance(BasicClass, {});
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
        expect(validationErrors[0].children.length).toBe(1);
        expect(validationErrors[0].property).toBe("nestedClasses");
        expect(validationErrors[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].property).toBe("0");
        expect(validationErrors[0].children[0].children[0].children.length).toBe(0);
        expect(validationErrors[0].children[0].children[0].property).toBe("title");
        expect(Object.keys(validationErrors[0].children[0].children[0].constraints).length).toBe(2);
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
    it("should not validate a property if it isn't present in the object, is undefined or is null and there is the @isOptional condition", async () => {
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
            title?: string;
        }

        const basicClassInvalid = new BasicClass();
        basicClassInvalid.nestedClass = new NestedClass();
        basicClassInvalid.nestedClass.title = "title";

        const validator = new Validator();

        //Not present
        const validationErrors = await validator.validate(basicClassInvalid);
        expect(validationErrors.length).toBe(0);

        // Undefined
        basicClassInvalid.title = undefined;
        const validationErrors2 = await validator.validate(basicClassInvalid);
        expect(validationErrors2.length).toBe(0);

        // Undefined
        // @ts-ignore
        basicClassInvalid.title = null;
        const validationErrors3 = await validator.validate(basicClassInvalid);
        expect(validationErrors3.length).toBe(0);
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

    it("should properly validate the nested element and return properly nested validation errors when path is provided with subnested array", async () => {
        class SubNestedArrayClass {
            @IsString()
            @Max(2)
            // @ts-ignore
            subNestedArrayTitle;
        }

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

            @validateNested()
            // @ts-ignore
            subNestedArray: SubNestedArrayClass[] = [];
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
        basicClass.nestedClass.subNestedArray.push(new SubNestedArrayClass());
        basicClass.nestedClass.subNestedArray[0].subNestedArrayTitle = 3

        const validator = new Validator();

        const validationErrors = await validator.validate(basicClass, {
            propertyPath: "nestedClass.subNestedArray"
        });

        console.log(JSON.stringify(validationErrors, null, 2));

        expect(validationErrors.length).toBe(1);
        expect(Object.keys(validationErrors[0].constraints).length).toBe(0);
        expect(validationErrors[0].property).toBe("nestedClass")
        expect(validationErrors[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].property).toBe("subNestedArray");
        expect(validationErrors[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].children[0].property).toBe("0");
        expect(validationErrors[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].children[0].property).toBe("0");
        expect(validationErrors[0].children[0].children[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].children[0].children[0].property).toBe("subNestedArrayTitle");
        expect(Object.keys(validationErrors[0].children[0].children[0].children[0].constraints).length).toBe(2);
    })

    it("should properly validate the nested element and return properly nested validation errors when path is provided with one element of the array", async () => {
        class SubNestedArrayClass {
            @IsString()
            @Max(2)
            // @ts-ignore
            subNestedArrayTitle;
        }

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

            @validateNested()
            // @ts-ignore
            subNestedArray: SubNestedArrayClass[] = [];
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
        basicClass.nestedClass.subNestedArray.push(new SubNestedArrayClass());
        basicClass.nestedClass.subNestedArray[0].subNestedArrayTitle = "Item 1"
        basicClass.nestedClass.subNestedArray.push(new SubNestedArrayClass());
        basicClass.nestedClass.subNestedArray[1].subNestedArrayTitle = 3

        const validator = new Validator();

        const validationErrors = await validator.validate(basicClass, {
            propertyPath: "nestedClass.subNestedArray.0.subNestedArrayTitle"
        });

        console.log(JSON.stringify(validationErrors, null, 2));

        expect(validationErrors.length).toBe(0);

        const validationErrors1 = await validator.validate(basicClass, {
            propertyPath: "nestedClass.subNestedArray.1"
        });

        console.log(JSON.stringify(validationErrors1, null, 2));

        expect(validationErrors1.length).toBe(1);
        expect(validationErrors1[0].property).toBe("nestedClass")
        expect(validationErrors1[0].children.length).toBe(1);
        expect(validationErrors1[0].children[0].property).toBe("subNestedArray");
        expect(validationErrors1[0].children[0].target).toBe(basicClass.nestedClass);
        expect(validationErrors1[0].children[0].children.length).toBe(1);
        expect(validationErrors1[0].children[0].children[0].property).toBe("1");
        expect(validationErrors1[0].children[0].children[0].target).toBe(basicClass.nestedClass.subNestedArray[1]);
        expect(validationErrors1[0].children[0].children[0].children[0].property).toBe("subNestedArrayTitle");
        expect(validationErrors1[0].children[0].children[0].children[0].target).toBe(basicClass.nestedClass.subNestedArray[1]);
        expect(validationErrors1[0].children[0].children[0].children[0].value).toBe(3);
        expect(Object.keys(validationErrors1[0].children[0].children[0].children[0].constraints).length).toBe(2);
    })

    it("should skip validation if validateIf condition is false", async () => {
        class SubNestedArrayClass {
            @ValidateIf((object, root: BasicClass, currentPath) => {
                let paths = currentPath?.split(".") ?? [];
                let indexes: number[] = []
                for (const path of paths) {
                    if(!isNaN(+path)){
                        indexes.push(+path);
                    }
                }
                return root.nestedArray[indexes[0]].subNested.subNestedTitle === "subNestedTitle";
            })
            @IsString()
            // @ts-ignore
            subNestedArrayTitle;
        }

        class SubNestedClass {
            @IsString()
            // @ts-ignore
            subNestedTitle: string;
        }

        class NestedArray {
            @validateNested()
            // @ts-ignore
            subNested: SubNestedClass;

            @validateNested()
            // @ts-ignore
            subNestedArray: SubNestedArrayClass[] = [];
        }

        class BasicClass {
            @validateNested()
            // @ts-ignore
            nestedArray: NestedArray[] = [];
        }

        const basicClass = new BasicClass();
        const nestedArray1 = new NestedArray();
        nestedArray1.subNested = new SubNestedClass();
        nestedArray1.subNested.subNestedTitle = "randomTitle";
        const subNestedArray1 = new SubNestedArrayClass();
        subNestedArray1.subNestedArrayTitle = 2;
        nestedArray1.subNestedArray.push(subNestedArray1);
        basicClass.nestedArray.push(nestedArray1);

        const nestedArray2 = new NestedArray();
        nestedArray2.subNested = new SubNestedClass();
        nestedArray2.subNested.subNestedTitle = "subNestedTitle";
        const subNestedArray2 = new SubNestedArrayClass();
        subNestedArray2.subNestedArrayTitle = 3;
        nestedArray2.subNestedArray.push(subNestedArray2);
        basicClass.nestedArray.push(nestedArray2);

        const validator = new Validator();

        const validationErrors =  await validator.validate(basicClass, {
            propertyPath: "nestedArray.0.subNestedArray.0.subNestedArrayTitle"
        });

        console.log(JSON.stringify(validationErrors, null, 2));

        expect(validationErrors.length).toBe(0);

        const validationErrors1 = await validator.validate(basicClass);

        console.log(JSON.stringify(validationErrors1, null, 2));

        expect(validationErrors1.length).toBe(1);
        expect(validationErrors1[0].property).toBe("nestedArray")
        expect(validationErrors1[0].children.length).toBe(1);
        expect(validationErrors1[0].children[0].property).toBe("1");
        expect(validationErrors1[0].children[0].children.length).toBe(1);
        expect(validationErrors1[0].children[0].children[0].property).toBe("subNestedArray");
        expect(validationErrors1[0].children[0].children[0].children.length).toBe(1);
        expect(validationErrors1[0].children[0].children[0].children[0].property).toBe("0");
        expect(validationErrors1[0].children[0].children[0].children[0].children.length).toBe(1);
        expect(validationErrors1[0].children[0].children[0].children[0].children[0].property).toBe("subNestedArrayTitle");
        expect(Object.keys(validationErrors1[0].children[0].children[0].children[0].children[0].constraints).length).toBe(1);
    })

    it("should validate children properties if validateNested even if error on whole array", async () => {
        class NestedArray {
            @isNotEmpty()
            @IsString()
            // @ts-ignore
            title: string;
        }

        class BasicClass {
            @validateNested()
            @customValidator(async (value: NestedArray[]) => {
                if(value.length != 1) {
                    return {
                        message: "There must be exactly one element.",
                        keyname: "EXACTLY_ONE",
                    } as ErrorMessage;
                }

                return null;
            })
            // @ts-ignore
            nestedArray: NestedArray[] = [];
        }

        const basicClass = new BasicClass();
        const nestedArray1 = new NestedArray();
        // @ts-ignore
        nestedArray1.title = 2;
        basicClass.nestedArray.push(nestedArray1);

        const nestedArray2 = new NestedArray();
        nestedArray2.title = "title";
        basicClass.nestedArray.push(nestedArray2);

        const validator = new Validator();

        const validationErrors =  await validator.validate(basicClass, {
            propertyPath: "nestedArray.0.title"
        });

        console.log(JSON.stringify(validationErrors, null, 2));

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].property).toBe("nestedArray");
        expect(Object.keys(validationErrors[0].constraints).length).toBe(1);
        expect(Object.keys(validationErrors[0].constraints)[0]).toBe("EXACTLY_ONE");
        expect(validationErrors[0].children.length).toBe(1);
        expect(validationErrors[0].children[0].property).toBe("0");
        expect(validationErrors[0].children[0].children[0].property).toBe("title");
        expect(Object.keys(validationErrors[0].children[0].children[0].constraints).length).toBe(1);
        expect(Object.keys(validationErrors[0].children[0].children[0].constraints)[0]).toBe("IS_STRING");

        const validationErrors1 = await validator.validate(basicClass, {
            propertyPath: "nestedArray.1.title"
        });

        console.log(JSON.stringify(validationErrors1, null, 2));

        expect(validationErrors1.length).toBe(1);
        expect(validationErrors1[0].property).toBe("nestedArray");
        expect(Object.keys(validationErrors1[0].constraints).length).toBe(1);
        expect(Object.keys(validationErrors1[0].constraints)[0]).toBe("EXACTLY_ONE");
        expect(validationErrors1[0].children.length).toBe(0);

        const validationErrors2 = await validator.validate(basicClass);

        console.log(JSON.stringify(validationErrors2, null, 2));

        expect(validationErrors2.length).toBe(1);
        expect(validationErrors2[0].property).toBe("nestedArray");
        expect(Object.keys(validationErrors2[0].constraints).length).toBe(1);
        expect(Object.keys(validationErrors2[0].constraints)[0]).toBe("EXACTLY_ONE");
        expect(validationErrors2[0].children.length).toBe(1);
        expect(validationErrors2[0].children[0].property).toBe("0");
        expect(validationErrors2[0].children[0].children[0].property).toBe("title");
        expect(Object.keys(validationErrors2[0].children[0].children[0].constraints).length).toBe(1);
        expect(Object.keys(validationErrors2[0].children[0].children[0].constraints)[0]).toBe("IS_STRING");
    })

    it("should validate only the properties if the group is specified", async () => {
        class NestedClass {
            @IsInt({
                groups: ["GroupA"]
            })
            @IsString({
                groups: ["GroupB"]
            })
            // @ts-ignore
            title: string;

            @IsString()
            // @ts-ignore
            description: string;
        }

        class BasicClass {
            @validateNested()
            // @ts-ignore
            nestedClass: NestedClass = new NestedClass();

            @validateNested({
                groups: ["GroupB"]
            })
            // @ts-ignore
            nestedClass2: NestedClass = new NestedClass();

            @IsString()
            @IsOptional({
                groups: ["GroupA"]
            })
            // @ts-ignore
            title?: string;
        }

        const basicClass = new BasicClass();
        const nestedClass = new NestedClass();
        // @ts-ignore
        nestedClass.title = 3;
        nestedClass.description = "Description"

        basicClass.nestedClass = nestedClass;

        const validator = new Validator();

        const validationErrors =  await validator.validate(basicClass, {
        });

        expect(validationErrors.length).toBe(1);
        expect(validationErrors[0].property).toBe("title");
        expect(validationErrors[0].constraints.IS_STRING).toBeDefined();

        const validationErrorsGroupA =  await validator.validate(basicClass, {
            groups: ["GroupA"],
        });

        expect(validationErrorsGroupA.length).toBe(0);

        const validationErrorsGroupB =  await validator.validate(basicClass, {
            groups: ["GroupB"],
        });


        expect(validationErrorsGroupB.length).toBe(3);
        expect(validationErrorsGroupB[0].property).toBe("nestedClass");
        expect(validationErrorsGroupB[0].children.length).toBe(1);
        expect(validationErrorsGroupB[0].children[0].property).toBe("title");
        expect(validationErrorsGroupB[0].children[0].constraints.IS_STRING).toBeDefined()
        expect(validationErrorsGroupB[1].property).toBe("nestedClass2");
        expect(validationErrorsGroupB[1].children.length).toBe(2);
        expect(validationErrorsGroupB[1].children[0].property).toBe("title");
        expect(validationErrorsGroupB[1].children[0].constraints.IS_STRING).toBeDefined()
        expect(validationErrorsGroupB[1].children[1].property).toBe("description");
        expect(validationErrorsGroupB[1].children[1].constraints.IS_STRING).toBeDefined()
        expect(validationErrorsGroupB[2].property).toBe("title")
        expect(validationErrorsGroupB[2].constraints.IS_STRING).toBeDefined();
    })
});
