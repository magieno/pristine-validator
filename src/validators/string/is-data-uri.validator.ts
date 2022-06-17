import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import isDataURIValidator from "validator/lib/isDataURI";

export class IsDataURIValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isDataURIValidator(value)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a data uri format",
            ConstraintErrorKeynameEnum.IsDataURI,
            value,
            property,
            target);
    }
}


// Decorator
export const isDataURI = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsDataURIValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsDataURI = isDataURI;
