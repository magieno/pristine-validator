import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isISSNValidator from 'validator/lib/isISSN';
import ValidatorJS from 'validator';

export class IsISSNValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly options?: ValidatorJS.IsISSNOptions, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isISSNValidator(value, this.options)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a ISSN",
            ConstraintErrorKeynameEnum.IsISSN,
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
export const isSSN = (options?: ValidatorJS.IsISSNOptions, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsISSNValidator(options, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsISSN = isSSN;