import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsEnumValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly entity: any, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if(metadata === undefined) {
            metadata = {};
        }

        const enumValues = Object.keys(this.entity).map(k => this.entity[k]);
        if (enumValues.indexOf(value) >= 0) {
            return null;
        }

        metadata.errorContext = {
            type: typeof value,
            enumValues: JSON.stringify(enumValues),
        };

        return this.generateErrorMessage("'" + property + "' must be a valid enum.",
            ConstraintErrorKeynameEnum.IsEnum,
            value,
            property,
            target,
            this,
            metadata);
    }

    public getConstraints(): any {
        return {
            entity: this.entity,
        }
    }
}


// Decorator
export const isEnum = (entity: any, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsEnumValidator(entity, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsEnum = isEnum;
