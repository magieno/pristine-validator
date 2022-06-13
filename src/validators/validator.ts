import {ValidatorInterface} from "../interfaces/validator.interface";
import {ConditionInterface} from "../interfaces/condition.interface";
import {ValidationError} from "../models/validation-error.model";
import {ErrorMessage} from "../types/error-message.type";
import {ValidationConstraintError} from "../types/validation-constraint-error.type";
import {PrototypeMetadataUtils} from "../utils/prototype-metadata.utils";

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
        const propertyMetadata = PrototypeMetadataUtils.getPropertyMetadata(objectToValidate, property);

        if(propertyMetadata.hasOwnProperty("validators") === false || Array.isArray(propertyMetadata.validators)) {
            return null;
        }

        const validators: ValidatorInterface[] = propertyMetadata.validators;

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

        return new ValidationError(property, value, objectToValidate, validationConstraints);
    }

    private async executeValidation(objectToValidate: any, defaultConditions: ConditionInterface[] = [], propertyPath: string[] = []): Promise<ValidationError[]> {
        if(typeof objectToValidate !== "object") {
            throw new Error("The Object to validate must be of type object. Type: '" + typeof objectToValidate + "'.")
        }

        let propertiesToVisit = [];

        let validationErrors: ValidationError[] = [];

        let visitOnlyInPropertyPath = false;

        // This means that we validate the specified property paths
        if(propertyPath.length !== 0) {
            visitOnlyInPropertyPath = true;

            // We visit only the first property, check if the property is valid
            const property = propertyPath.shift();

            if (property === undefined || objectToValidate.hasOwnProperty(property) === false) {
                throw new Error("The property '" + property + "' doesn't exist on the object");
            }

            propertiesToVisit.push(property);
        }
        else {
            // If there are no property path, we validate all the paths.
            // Loop over all the properties in the object that needs to be validated, then check for each if there are any validators associated.
            propertiesToVisit = Object.keys(objectToValidate);
        }

        for (let property in propertiesToVisit) {
            if (!objectToValidate.hasOwnProperty(property)) {
                continue;
            }

            // todo: Find the conditions for this property and execute them.

            const validationError: ValidationError | null = await this.executeValidatorsOnProperty(property, objectToValidate)

            // If there is a validation error, we save it and directly continue to visit the next property.
            if(validationError !== null) {
                validationErrors.push(validationError);
                continue;
            }

            const value = objectToValidate[property];

            // If there are nested elements and there is a @validateNested annotation, we must validate them further.
            const propertyMetadata = PrototypeMetadataUtils.getPropertyMetadata(objectToValidate, property);
            const shouldValidateNested = propertyMetadata.hasOwnProperty("shouldValidateNested") && propertyMetadata.shouldValidateNested;

            // If we visit only specific properties, the value must be a nested element if there are additional property paths
            if(visitOnlyInPropertyPath && propertyPath.length !== 0 && typeof value !== 'object' && Array.isArray(value) === false) {
                throw new Error("The property '" + property + "' from propertyPath is not an object or an array.")
            }

            if( shouldValidateNested === false && visitOnlyInPropertyPath === false ) {
                continue;
            }

            if(typeof value === 'object') {
                const nestedValidationErrors = await this.executeValidation(value, defaultConditions, propertyPath);

                if(nestedValidationErrors.length === 0) {
                    continue;
                }

                const validationError = new ValidationError(property, value, objectToValidate)
                validationError.children.push(...nestedValidationErrors);

                // Add the errors to the list of validation errors
                validationErrors.push(validationError);
            } else if(Array.isArray(value)) {
                const nestedValidationErrors: ValidationError[] = [];

                for (const element of value) {
                    nestedValidationErrors.push(... (await this.executeValidation(element, defaultConditions, propertyPath)));
                }

                if(nestedValidationErrors.length === 0) {
                    continue;
                }

                const validationError = new ValidationError(property, value, objectToValidate)
                validationError.children.push(...nestedValidationErrors);

                // Add the errors to the list of validation errors
                validationErrors.push(validationError);
            }
        }

        return validationErrors;
    }


    /**
     * This method takes an object to validate and return the list of validation errors it finds.
     *
     * If there are no validation errors, the object is to be considered valid.
     * @param objectToValidate
     * @param parameters
     */
    public async validate(objectToValidate: any, parameters: {
        propertyPath?: string
    }): Promise<ValidationError[]> {
        let validationErrors: ValidationError[] = [];

        let propertyPaths: string[] = [];

        if(parameters.propertyPath) {
            propertyPaths = parameters.propertyPath.split(".");
        }

        // If object is array, loop over the array and validate each object inside
        if(Array.isArray(objectToValidate)) {
            for (const object of objectToValidate) {
                validationErrors.push(... (await this.executeValidation(object, [], propertyPaths)));
            }
        } else {
            validationErrors = await this.executeValidation(objectToValidate, [], propertyPaths);
        }

        return validationErrors;
    }
}
