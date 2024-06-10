import "reflect-metadata"
import {ValidatorInterface} from "./interfaces/validator.interface";
import {ConditionInterface} from "./interfaces/condition.interface";
import {ValidationError} from "./models/validation-error.model";
import {ErrorMessage} from "./types/error-message.type";
import {ValidationConstraintError} from "./types/validation-constraint-error.type";
import {ClassMetadata, PropertyMetadata} from "@pristine-ts/metadata";
import {MetadataKeynameEnum} from "./enums/metadata-keyname.enum";
import {ValidationOptionsInterface} from "./interfaces/validation-options.interface";

export class Validator {
    /**
     * This method executes all the validators that are attached on the property as decorators
     * @param property
     * @param objectToValidate
     */
    public async executeValidatorsOnProperty(property: string, objectToValidate: any, metadata?: any, options: {groups?: string[]} = {}): Promise<ValidationError | null> {
        // Retrieve the value from the object
        const value = objectToValidate[property];

        // Find the validators associated with this particular property for this object.
        const validators: ValidatorInterface[] | undefined = PropertyMetadata.getMetadata(objectToValidate, property, MetadataKeynameEnum.Validator);

        if(validators === undefined || Array.isArray(validators) === false) {
            return null;
        }

        const validationConstraints: ValidationConstraintError = {};

        let isValid = true;

        // Run each validator and ensure that they properly implement the ValidatorInterface
        for (const validator of validators) {
            if (typeof validator.validate === "undefined") {
                throw new Error("The validator with name: '" + validator.constructor.name + "' doesn't implement the ValidatorInterface");
            }

            const validationOptions: ValidationOptionsInterface | undefined = validator.getValidationOptions();

            // If there are groups in the options and that the validator has groups, we need to check if the groups are the same. If the validator has no group, we still validate it.
            if(validationOptions && validationOptions.groups && validationOptions.groups.length > 0 && !validationOptions.groups.some((group) => options.groups?.includes(group))) {
                continue;
            }

            const errorMessage: ErrorMessage | null = await validator.validate(value, property, objectToValidate, metadata);

            if (errorMessage === null) {
                continue;
            }

            validationConstraints[errorMessage.keyname] = errorMessage;
            isValid = false;
        }

        if (isValid) {
            return null;
        }

        return new ValidationError(property, value, objectToValidate, validationConstraints);
    }

    /**
     * This method recursively executes the validation on each property of the object to validate.
     *
     * If there are specific property paths to check, all other properties of the object are not validated.
     *
     * @param objectToValidate
     * @param rootObject
     * @param defaultConditions
     * @param propertyPath
     * @param currentPath
     * @param metadata
     * @private
     */

    private async executeValidation(objectToValidate: any, rootObject: any, defaultConditions: ConditionInterface[] = [], options: {propertyPath?: string[], groups?: string[]} = {}, currentPath: string = "", metadata?: any): Promise<ValidationError[]> {
        if (typeof objectToValidate !== "object") {
            throw new Error("The Object to validate must be of type object. Type: '" + typeof objectToValidate + "'.")
        }

        let propertiesToVisit = [];

        let validationErrors: ValidationError[] = [];

        let visitOnlyInPropertyPath = false;

        // This means that we validate the specified property paths
        if (options.propertyPath && options.propertyPath.length !== 0) {
            visitOnlyInPropertyPath = true;

            // We visit only the first property, check if the property is valid
            const property = options.propertyPath.shift();

            if (property === undefined) {
                throw new Error("The property '" + property + "' is undefined and shouldn't be.");
            }

            propertiesToVisit.push(property);
        } else {
            // If there are no property path, we validate all the paths.
            // Loop over all the properties in the object that needs to be validated, then check for each if there are any validators associated.
            const metadata = ClassMetadata.getInformation(objectToValidate.constructor);
            propertiesToVisit = metadata.properties;
        }

        for (let property of propertiesToVisit) {
            currentPath += currentPath.length > 0 ? "." + property : property;
            const value = objectToValidate[property];

            const conditions: ConditionInterface[] = PropertyMetadata.getMetadata(objectToValidate, property, MetadataKeynameEnum.Condition);

            if (conditions && Array.isArray(conditions)) {
                let shouldPropertyBeValidated = true;
                for (let condition of conditions) {
                    const validationOptions: ValidationOptionsInterface | undefined = condition.getValidationOptions();

                    // Don't execute a condition if it specifies a group and the group is not in the options.
                    if(validationOptions && validationOptions.groups && validationOptions.groups.length > 0 && !validationOptions.groups.some((group) => options.groups?.includes(group))) {
                        continue;
                    }

                    if (condition.shouldBeValidated(value, property, objectToValidate, rootObject, currentPath) === false) {
                        shouldPropertyBeValidated = false;
                        continue;
                    }
                }
                if (shouldPropertyBeValidated === false) {
                    continue;
                }
            }

            const validationError: ValidationError | null = await this.executeValidatorsOnProperty(property, objectToValidate, {}, {groups: options.groups})

            // If there are nested elements and there is a @validateNested annotation, we must validate them further.
            const validateNestedValidationOptions: ValidationOptionsInterface | undefined = PropertyMetadata.getMetadata(objectToValidate, property, MetadataKeynameEnum.ValidateNested) ?? undefined;

            // If we visit only specific properties, the value must be a nested element if there are additional property paths
            if (visitOnlyInPropertyPath && options.propertyPath && options.propertyPath.length !== 0 && typeof value !== 'object' && Array.isArray(value) === false) {
                throw new Error("The property '" + property + "' from propertyPath is not an object or an array.")
            }

            if ( (validateNestedValidationOptions === undefined || (validateNestedValidationOptions.groups && validateNestedValidationOptions.groups.length > 0 && !validateNestedValidationOptions.groups.some((group) => options.groups?.includes(group)))) && visitOnlyInPropertyPath === false) {
                // If we have a validation error we save it before continuing to next property
                if (validationError !== null) {
                    validationErrors.push(validationError);
                }
                continue;
            }

            if (Array.isArray(value)) {
                let validateOnlyOneItem = false
                let indexToValidate;
                if (options.propertyPath && options.propertyPath.length !== 0) {
                    indexToValidate = options.propertyPath && options.propertyPath.shift();
                    if (indexToValidate === undefined || isNaN(+indexToValidate)) {
                        throw new Error("The property path in an array should be a number");
                    }
                    indexToValidate = +indexToValidate;
                    validateOnlyOneItem = true;
                }
                const nestedValidationErrors: ValidationError[] = [];

                for (const [index, element] of value.entries()) {
                    if (validateOnlyOneItem && indexToValidate !== index) {
                        continue;
                    }

                    let indexCurrentPath = currentPath + "." + index;
                    const inArrayElementValidationErrors = await this.executeValidation(element, rootObject, defaultConditions, options, indexCurrentPath, metadata);


                    if (inArrayElementValidationErrors.length === 0) {
                        continue;
                    }

                    const inArrayValidationError = new ValidationError(index + "", element, element);
                    inArrayValidationError.children.push(...inArrayElementValidationErrors)

                    nestedValidationErrors.push(inArrayValidationError);
                }

                if (nestedValidationErrors.length === 0) {
                    // If there was already a parent validation error we need to push it.
                    if (validationError !== null) {
                        validationErrors.push(validationError);
                    }
                    continue;
                }

                // If we already have a validation error, we want to add the errors in the array as children errors.
                // If not we create a new parent error.
                const validationError1 = validationError ?? new ValidationError(property, value, objectToValidate)
                validationError1.children.push(...nestedValidationErrors);

                // Add the errors to the list of validation errors
                validationErrors.push(validationError1);
            } else if (typeof value === 'object') {
                const nestedValidationErrors = await this.executeValidation(value, rootObject, defaultConditions, options, currentPath, metadata);

                if (nestedValidationErrors.length === 0) {
                    // If there was already a parent validation error we need to push it.
                    if (validationError !== null) {
                        validationErrors.push(validationError);
                    }
                    continue;
                }

                // If we already have a validation error, we want to add the errors in the object as children errors.
                // If not we create a new parent error.
                const validationError1 = validationError ?? new ValidationError(property, value, objectToValidate)
                validationError1.children.push(...nestedValidationErrors);

                // Add the errors to the list of validation errors
                validationErrors.push(validationError1);
            } else {
                // If it's not an array or object we have to push the validation error.
                if (validationError !== null) {
                    validationErrors.push(validationError);
                }
            }
        }

        return validationErrors;
    }


    /**
     * This method takes an object (or an array of objects) to validate and return the list of validation errors it finds.
     *
     * If there are no validation errors, the object is to be considered valid.
     *
     * The propertyPath parameters takes a path using dot notation: ex: nestedClass.secondLevelNestedClass.title and this property will only be the one to be validated. This is useful to check if one specific property is valid or not without validting the whole object.
     * @param objectToValidate
     * @param parameters
     */
    public async validate(objectToValidate: any, parameters: {
        propertyPath?: string,
        groups?: string[],
    } = {}, metadata?: any): Promise<ValidationError[]> {
        let validationErrors: ValidationError[] = [];

        let propertyPaths: string[] = [];

        if (parameters.propertyPath) {
            propertyPaths = parameters.propertyPath.split(".");
        }

        // If object is array, loop over the array and validate each object inside
        if (Array.isArray(objectToValidate)) {
            for (const [index, object] of objectToValidate.entries()) {
                const nestedValidationErrors = await this.executeValidation(object, objectToValidate, [], {propertyPath: propertyPaths, groups: parameters.groups},"", metadata);

                if (nestedValidationErrors.length === 0) {
                    continue;
                }

                const validationError = new ValidationError(index + "", object, object);
                validationError.children.push(...nestedValidationErrors);

                validationErrors.push(validationError);
            }
        } else {
            validationErrors = await this.executeValidation(objectToValidate, objectToValidate, [], {propertyPath: propertyPaths, groups: parameters.groups}, "", metadata);
        }

        return validationErrors;
    }
}
