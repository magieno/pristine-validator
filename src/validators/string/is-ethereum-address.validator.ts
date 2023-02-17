import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isEthereumAddressValidator from "validator/lib/isEthereumAddress";

export class IsEthereumAddressValidator extends BaseValidator implements ValidatorInterface {
    public constructor(buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && isEthereumAddressValidator(value)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "'  must be an Ethereum address",
            ConstraintErrorKeynameEnum.IsEthereumAddress,
            value,
            property,
            target,
            metadata);
    }
}


// Decorator
export const isEthereumAddress = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsEthereumAddressValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsEthereumAddress = isEthereumAddress;
