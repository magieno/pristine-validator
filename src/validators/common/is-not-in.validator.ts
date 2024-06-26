import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsNotInValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly possibleValues: unknown[], validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
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

        if (this.possibleValues.some(possibleValue => possibleValue === value)) {
            return this.generateErrorMessage("'" + property + "' should not be one of the following values: '" + this.possibleValues.join(",") + "'",
                ConstraintErrorKeynameEnum.IsNotIn,
                value,
                property,
                target,
                this,
                metadata);
        }

        return null;
    }

    public getConstraints(): any {
        return {
            possibleValues: this.possibleValues,
        }
    }
}


// Decorator
export const isNotIn = (possibleValues: unknown[], validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsNotInValidator(possibleValues, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsNotIn = isNotIn;