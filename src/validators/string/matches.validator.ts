import { BaseValidator } from "../base.validator";
import { ValidatorInterface } from "../../interfaces/validator.interface";
import { ErrorMessage } from "../../types/error-message.type";
import { BuildErrorMessageType } from "../../types/build-error-message.type";
import { addValidator } from "../../helpers/add-validator";
import { ConstraintErrorKeynameEnum } from "../../enums/constraint-error-keyname.enum";
import matchesValidator from "validator/lib/matches";

export class MatchesValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly pattern: RegExp, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        // todo do we want to support string with modifiers ?
        if(typeof value === 'string' && matchesValidator(value, this.pattern as unknown as any)){
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must match '" + this.pattern + "' regular expression",
            ConstraintErrorKeynameEnum.Matches,
            value,
            property,
            target);
    }
}


// Decorator
export const matches = (pattern: RegExp, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new MatchesValidator(pattern, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const Matches = matches;

