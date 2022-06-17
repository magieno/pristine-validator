import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsInValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly possibleValues: unknown[], buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if (!Array.isArray(value)) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Array' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.ArrayInvalid,
                value,
                property,
                target);
        }

        if(this.possibleValues.some(possibleValue => possibleValue === value) === false) {
            return this.generateErrorMessage("Property '" + property + "' must be one of the following values: '" + this.possibleValues.join(",") + "'.",
                ConstraintErrorKeynameEnum.IsIn,
                value,
                property,
                target);
        }

        return null;
    }
}


// Decorator
export const isIn = (possibleValues: unknown[], buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsInValidator(possibleValues, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsIn = isIn;