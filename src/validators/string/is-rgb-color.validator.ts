import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isRgbColorValidator from 'validator/lib/isRgbColor';

export class IsRgbColorValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly includePercentValues?: boolean, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isRgbColorValidator(value, this.includePercentValues)) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("$ERROR_MESSAGE$",
            ConstraintErrorKeynameEnum.IsRgbColor,
            value,
            property,
            target);
    }
}


// Decorator
export const isRgbColor = (includePercentValues?: boolean, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsRgbColorValidator(includePercentValues, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsRgbColor = isRgbColor;
