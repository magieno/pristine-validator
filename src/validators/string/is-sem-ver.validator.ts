import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {ValidationOptionsInterface} from "../../interfaces/validation-options.interface";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
import isSemVerValidator from 'validator/lib/isSemVer';

export class IsSemVerValidator extends BaseValidator implements ValidatorInterface {
    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        // todo: CODE HERE

        // todo: Error message
        return this.generateErrorMessage("'" + property + "' must follow the Semantic Versioning Specification",
            ConstraintErrorKeynameEnum.IsSemVer,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {}
    }
}


// Decorator
export const isSemVer = (validationOptions?: ValidationOptionsInterface) => {
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
        const validator = new IsSemVerValidator(validationOptions);

        addValidator(target, propertyKey, validator)
    }
}

export const IsSemVer = isSemVer;

