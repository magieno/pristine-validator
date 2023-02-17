import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import ValidatorJS from "validator";
import isUrlValidator from "validator/lib/isURL";

export class IsUrlValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsURLOptions, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isUrlValidator(value, this.options)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be an URL address",
            ConstraintErrorKeynameEnum.IsUrl,
            value,
            property,
            target,
            metadata);
    }
}


// Decorator
export const isUrl = (options?: ValidatorJS.IsURLOptions, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsUrlValidator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsUrl = isUrl;
