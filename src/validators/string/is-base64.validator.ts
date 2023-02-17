import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import isBase64Validator from "validator/lib/isBase64";

export class IsBase64Validator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isBase64Validator(value)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be base64 encoded",
            ConstraintErrorKeynameEnum.IsBase64,
            value,
            property,
            target,
            metadata);
    }
}


// Decorator
export const isBase64 = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsBase64Validator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsBase64 = isBase64;
