import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import ValidatorJS from "validator";
import { isISO8601 } from "./IsISO8601";

export class IsDateStringValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsISO8601Options, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isISO8601(value, this.options)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a valid ISO 8601 date string",
            ConstraintErrorKeynameEnum.IsDateString,
            value,
            property,
            target);
    }
}


// Decorator
export const isDateString = (options?: ValidatorJS.IsISO8601Options, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsDateStringValidator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDateString = isDateString;
