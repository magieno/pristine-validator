import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isUuidValidator from "validator/lib/isUUID";

export type UUIDVersion = '3' | '4' | '5' | 'all' | 3 | 4 | 5;

export class IsUUIDValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly uuidVersion?: UUIDVersion, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isUuidValidator(value, this.uuidVersion)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a UUID",
            ConstraintErrorKeynameEnum.IsUUID,
            value,
            property,
            target);
    }
}


// Decorator
export const isUUID = (uuidVersion?: UUIDVersion, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsUUIDValidator(uuidVersion, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsUUID = isUUID;
