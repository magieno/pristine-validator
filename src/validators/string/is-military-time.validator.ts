import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import matchesValidator from 'validator/lib/matches';

export class IsMilitaryTimeValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        const militaryTimeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
        if(typeof value === 'string' && matchesValidator(value, militaryTimeRegex)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must be a valid representation of military time in the format HH:MM",
            ConstraintErrorKeynameEnum.IsMilitaryTime,
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
export const isMilitaryTime = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsMilitaryTimeValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsMilitaryTime = isMilitaryTime;