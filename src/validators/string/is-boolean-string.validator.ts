import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isBooleanValidator from "validator/lib/isBoolean";

export class IsBooleanStringValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && isBooleanValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a boolean string",
            ConstraintErrorKeynameEnum.IsBooleanString,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isBooleanString = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsBooleanStringValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsBooleanString = isBooleanString;
