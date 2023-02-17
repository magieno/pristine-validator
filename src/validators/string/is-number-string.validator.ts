import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isNumericValidator from 'validator/lib/isNumeric';
import ValidatorJS from 'validator';

export class IsNumberStringValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsNumericOptions, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isNumericValidator(value, this.options)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a number string",
            ConstraintErrorKeynameEnum.IsNumberString,
            value,
            property,
            target,
            metadata);
    }

    public getConstraints(): any {
        return {
            options: this.options,
        }
    }
}


// Decorator
export const isNumberString = (options?: ValidatorJS.IsNumericOptions, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsNumberStringValidator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsNumberString = isNumberString;
