import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import ValidatorJS from "validator";
import isHashValidator from "validator/lib/isHash";

/**
 * Check if the string is a hash of type algorithm.
 * Algorithm is one of ['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128',
 * 'tiger160', 'tiger192', 'crc32', 'crc32b']
 */
export class IsHashValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly algorithm: ValidatorJS.HashAlgorithm, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isHashValidator(value, this.algorithm)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a hash of type '" + this.algorithm + "'",
            ConstraintErrorKeynameEnum.IsHash,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            algorithm: this.algorithm,
        }
    }
}


// Decorator
export const isHash = (algorithm: ValidatorJS.HashAlgorithm, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsHashValidator(algorithm, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsHash = isHash;
