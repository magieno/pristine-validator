import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import containsValidator from 'validator/lib/contains';

export class ContainsValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly seedToContain: string, validationOptions?: ValidationOptionsInterface) {
        super(validationOptions);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (typeof value === 'string' && containsValidator(value, this.seedToContain)) {
            return null;
        }

        return this.generateErrorMessage("'" + property + "' must contain a '" + this.seedToContain + "' string",
            ConstraintErrorKeynameEnum.Contains,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            seedToContain: this.seedToContain,
        }
    }
}


// Decorator
export const contains = (seedToContain: string, validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new ContainsValidator(seedToContain, validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const Contains = contains;
