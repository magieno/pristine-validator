import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsInstanceValidator extends BaseValidator implements ValidatorInterface {
    public constructor(private readonly targetTypeConstructor: new (...args: any[]) => any, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }


    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(this.targetTypeConstructor && typeof this.targetTypeConstructor === 'function' && value instanceof this.targetTypeConstructor) {
            return null;
        }

        return this.generateErrorMessage("The property '" + property + "' must be an instance of '" + this.targetTypeConstructor.name + "'.",
            ConstraintErrorKeynameEnum.IsInstance,
            value,
            property,
            target,
            metadata);
    }

    public getConstraints(): any {
        return {
            targetTypeConstructor: this.targetTypeConstructor,
        }
    }
}

// Decorator
export const isInstance = (targetTypeConstructor: new (...args: any[]) => any, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsInstanceValidator(targetTypeConstructor, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsInstance = isInstance;