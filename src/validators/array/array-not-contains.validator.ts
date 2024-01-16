import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class ArrayNotContainsValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly values: any[], buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (!Array.isArray(value)) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Array' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.ArrayInvalid,
                value,
                property,
                target,
                this,
                metadata);
        }

        for (const elementToFind of this.values) {
            if (value.indexOf(elementToFind) !== -1) {
                return this.generateErrorMessage("The element '" + elementToFind + "' was found and should not be found in the array at property '" + property + "'.",
                    ConstraintErrorKeynameEnum.ArrayNotContains,
                    value,
                    property,
                    target,
                    this,
                    metadata);
            }
        }

        // Here, it means we have not found any of the elements
        return null;
    }

    public getConstraints(): any {
        return {
            values: this.values,
        }
    }
}

// Decorator
export const arrayNotContains = (values: any[], buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new ArrayNotContainsValidator(values, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const ArrayNotContains = arrayNotContains;
