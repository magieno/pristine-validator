import {ValidatorInterface} from "../interfaces/validator.interface";
import {ConditionInterface} from "../interfaces/condition.interface";
import {ValidationError} from "../models/validation-error.model";
import {ErrorMessage} from "../types/error-message.type";
import {ValidationConstraintError} from "../types/validation-constraint-error.type";

export class Validator {
    /**
     *
     * @param property
     * @param objectToValidate
     */
    public async executeValidatorsOnProperty(property: string, objectToValidate: any): Promise<ValidationError | null> {
        // Retrieve the value from the object
        const value = objectToValidate[property];

        // Find the validators associated with this particular property for this object.
        const validators: ValidatorInterface[] = objectToValidate.constructor.prototype["__metadata__"]["validators"][property];

        const validationConstraints: ValidationConstraintError = {};

        let isValid = true;

        // Run each validator and ensure that they properly implement the ValidatorInterface
        for (const validator of validators) {
            if (typeof validator.validate === "undefined") {
                throw new Error ("The validator with name: '" + validator.constructor.name + "' doesn't implement the ValidatorInterface");
            }

            const errorMessage: ErrorMessage | null = await validator.validate(value, property, objectToValidate);

            if(errorMessage === null) {
                continue;
            }

            validationConstraints[validator.getName()] = errorMessage;
            isValid = false;
        }

        if(isValid)  {
            return null;
        }

        const validationError: ValidationError = new ValidationError(property, value, objectToValidate, validationConstraints);


        return validationError;
    }

    private executeValidation(objectToValidate: any, defaultConditions: ConditionInterface[] = [], propertyPaths: string[][] = []): ValidationError[] {
        if(typeof objectToValidate !== "object") {
            throw new Error("The Object to validate must be of type object. Type: '" + typeof objectToValidate + "'.")
        }

        // todo: Handle when there are propertyPaths specified. We need to take the first one and keep the remainder and pass it recursively.

        // This means that we validate the specified property paths
        let properties = propertyPaths;

        if(propertyPaths.length === 0) {
            properties = Object.keys(objectToValidate);
        }

        // Loop over all the properties in the object that needs to be validated, then check for each if there are any validators associated.
        for (let property in objectToValidate) {
            if (!objectToValidate.hasOwnProperty(property)) {
                continue;
            }

            // todo: Find the conditions for this property and execute them.

            // todo: deal with the children or nested elements.

        }
    }

    /**
     * This method takes an object to validate and return the list of validation errors it finds.
     *
     * If there are no validation errors, the object is to be considered valid.
     * @param objectToValidate
     * @param parameters
     */
    validate = (objectToValidate: any, parameters: {
        propertyPaths?: string[]
    }): ValidationError[] => {
        let validationErrors: ValidationError[] = [];

        let propertyPaths: string[][] = [];

        if(parameters.propertyPaths && Array.isArray(parameters.propertyPaths)) {
            propertyPaths = parameters.propertyPaths.map(propertyPath => propertyPath.split("."));
        }

        // If object is array, loop over the array and validate each object inside
        if(Array.isArray(objectToValidate)) {
            objectToValidate.forEach(object => validationErrors.push(...this.executeValidation(object, [], propertyPaths)));
        } else {
            validationErrors = this.executeValidation(objectToValidate, [], propertyPaths);
        }

        return validationErrors;
    }
}
