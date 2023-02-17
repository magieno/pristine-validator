import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class ArrayContainsValidator extends BaseValidator implements ValidatorInterface {
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
            metadata);
        }

        for (const elementToFind of this.values) {
            if(value.indexOf(elementToFind) === -1) {
                return this.generateErrorMessage("The element '" + elementToFind + "' wasn't found in the array at property '" + property + "'.",
                    ConstraintErrorKeynameEnum.ArrayContains,
                    value,
                    property,
            target,
            metadata);
            }
        }

        // Here, it means we have found all the elements
        return null;
    }
}


// Decorator
export const arrayContains = (values: any[], buildErrorMessage?: BuildErrorMessageType) => {
    return (
        /**
         * The class on which the decorator is used.
         */
        target: any,

        /**
         * The property on which the decorator is used.
         */
        property: string,
    ) => {
        const validator = new ArrayContainsValidator(values, buildErrorMessage);

        addValidator(target, property, validator)
    }
}

export const ArrayContains = arrayContains;