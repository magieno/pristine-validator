import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class ArrayMinSizeValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly min: number, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (!Array.isArray(value)) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Array' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.ArrayInvalid,
                value,
                property,
                target);
        }

        if (value.length >= this.min) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("The property '" + property + "' should have at least '" + this.min + "' elements.",
            ConstraintErrorKeynameEnum.ArrayMinSize,
            value,
            property,
            target, metadata);
    }
}


// Decorator
export const arrayMinSize = (min: number, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new ArrayMinSizeValidator(min, buildErrorMessage);

        addValidator(target, property, validator)
    }
}

export const ArrayMinSize = arrayMinSize;