import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import isCreditCardValidator from "validator/lib/isCreditCard";

export class IsCreditCardValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isCreditCardValidator(value)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a credit card",
            ConstraintErrorKeynameEnum.IsCreditCard,
            value,
            property,
            target,
            metadata);
    }

    public getConstraints(): any {
        return {
        }
    }
}


// Decorator
export const isCreditCard = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsCreditCardValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsCreditCard = isCreditCard;
