import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isBtcAddressValidator from "validator/lib/isBtcAddress";

export class IsBtcAddressValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isBtcAddressValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "'  must be a BTC address",
            ConstraintErrorKeynameEnum.IsBtcAddress,
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
export const isBtcAddress = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsBtcAddressValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsBtcAddress = isBtcAddress;
