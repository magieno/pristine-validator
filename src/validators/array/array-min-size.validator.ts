import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class ArrayMinSizeValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly min: number, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {

        if(metadata === undefined) {
            metadata = {};
        }

        if (!Array.isArray(value)) {
            metadata.errorContext = {
                type: typeof value,
            };

            return this.generateErrorMessage("The property '" + property + "' should be of 'Array' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.ArrayInvalid,
                value,
                property,
                target,
                this,
                metadata);
        }

        if (value.length >= this.min) {
            return null;
        }

        metadata.errorContext = {
            length: value.length,
        };

        // todo: Error message
        return this.generateErrorMessage("The property '" + property + "' should have at least '" + this.min + "' elements.",
            ConstraintErrorKeynameEnum.ArrayMinSize,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            min: this.min,
        }
    }
}


// Decorator
export const arrayMinSize = (min: number, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new ArrayMinSizeValidator(min, validationOptions);

        addValidator(target, property, validator)
    }
}

export const ArrayMinSize = arrayMinSize;