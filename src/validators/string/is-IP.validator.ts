import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isIPValidator from 'validator/lib/isIP';

export type IsIpVersion = '4' | '6' | 4 | 6;

export class IsIPValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly version?: IsIpVersion, validationOptions?: ValidationOptionsInterface) {
        super();
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        const versionStr = this.version ? (`${this.version}` as '4' | '6') : undefined;
        if (typeof value === 'string' && isIPValidator(value, versionStr)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be an ip address",
            ConstraintErrorKeynameEnum.IsIP,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            version: this.version,
        }
    }
}

// Decorator
export const isIP = (version?: IsIpVersion, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsIPValidator(version, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsIP = isIP;

