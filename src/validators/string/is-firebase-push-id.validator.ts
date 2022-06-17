import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsFirebasePushIdValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        const webSafeRegex = /^[a-zA-Z0-9_-]*$/;
        if(typeof value === 'string' && value.length === 20 && webSafeRegex.test(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a Firebase Push Id",
            ConstraintErrorKeynameEnum.IsFirebasePushId,
            value,
            property,
            target);
    }
}


// Decorator
export const isFirebasePushId = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsFirebasePushIdValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsFirebasePushId = isFirebasePushId;
