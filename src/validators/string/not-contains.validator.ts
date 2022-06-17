import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import containsValidator from "validator/lib/contains";

export class NotContainsValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly seedNotToContain: string, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        if(typeof value === 'string' && !containsValidator(value, this.seedNotToContain)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must not contain a '" + this.seedNotToContain + "' string",
            ConstraintErrorKeynameEnum.NotContains,
            value,
            property,
            target);
    }
}


// Decorator
export const notContains = (seedToContain: string, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new NotContainsValidator(seedToContain, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const NotContains = notContains;
