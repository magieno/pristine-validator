import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import isHexColorValidator from "validator/lib/isHexColor";

export class IsHexColorValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isHexColorValidator(value)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a hexadecimal color",
            ConstraintErrorKeynameEnum.IsHexColor,
            value,
            property,
            target);
    }
}


// Decorator
export const isHexColor = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsHexColorValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsHexColor = isHexColor;
