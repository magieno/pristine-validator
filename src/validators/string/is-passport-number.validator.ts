import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isPassportNumberValidator from 'validator/lib/isPassportNumber';

export class IsPassportNumberValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        // todo: CODE HERE

        // todo: Error message
        return this.generateErrorMessage("'" + property + "' must be valid passport number",
            ConstraintErrorKeynameEnum.IsPassportNumber,
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
export const isPassportNumber = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsPassportNumberValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsPassportNumber = isPassportNumber;
