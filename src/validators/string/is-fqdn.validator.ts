import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import ValidatorJS from "validator";
import isFQDNValidator from "validator/lib/isFQDN";

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export class IsFQDNValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsFQDNOptions, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isFQDNValidator(value, this.options)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a valid domain name",
            ConstraintErrorKeynameEnum.IsFQDN,
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
export const isFQDN = (options?: ValidatorJS.IsFQDNOptions, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsFQDNValidator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsFQDN = isFQDN;
