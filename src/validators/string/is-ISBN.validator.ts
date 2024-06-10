import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isIsbnValidator from 'validator/lib/isISBN';

export type IsISBNVersion = '10' | '13' | 10 | 13;

export class IsISBNValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly version?: IsISBNVersion, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        const versionStr = this.version ? (`${this.version}` as '10' | '13') : undefined;
        if (typeof value === 'string' && isIsbnValidator(value, versionStr)) {
            return null;
        }

        // todo: Error message
        return this.generateErrorMessage("'" + property + "' must be an ISBN",
            ConstraintErrorKeynameEnum.IsISBN,
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
export const isISBN = (version?: IsISBNVersion, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsISBNValidator(version, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsISBN = isISBN;
