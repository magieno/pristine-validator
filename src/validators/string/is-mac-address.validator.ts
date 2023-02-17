import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isMacAddressValidator from 'validator/lib/isMACAddress';
import ValidatorJS from 'validator';

export class IsMacAddressValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsMACAddressOptions, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isMacAddressValidator(value, this.options)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a MAC Address",
            ConstraintErrorKeynameEnum.IsMacAddress,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            options: this.options,
        }
    }
}

// Decorator
export const isMacAddress = (options?: ValidatorJS.IsMACAddressOptions, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsMacAddressValidator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsMacAddress = isMacAddress;
