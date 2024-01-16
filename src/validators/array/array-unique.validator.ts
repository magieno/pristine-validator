import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class ArrayUniqueValidator extends BaseValidator implements ValidatorInterface {
    constructor(private readonly uniqueIdentifier?: (o: any) => any, buildErrorMessage?: BuildErrorMessageType) {
        super(buildErrorMessage);
    }

    async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
        if (!Array.isArray(value)) {
            return this.generateErrorMessage("The property '" + property + "' should be of 'Array' type, but it was of type '" + typeof value + "'.",
                ConstraintErrorKeynameEnum.ArrayInvalid,
                value,
                property,
                target,
                this,
                metadata);
        }

        let array = value;

        if (this.uniqueIdentifier !== undefined) {
            array = array.map(o => (o != null ? this.uniqueIdentifier!(o) : o));
        }

        const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b);
        if (array.length !== uniqueItems.length) {
            return this.generateErrorMessage("The array at property doesn't only contain unique elements.",
                ConstraintErrorKeynameEnum.ArrayUnique,
                value,
                property,
                target,
                this,
                metadata);
        }

        return null;
    }

    public getConstraints(): any {
        return {
            uniqueIdentifier: this.uniqueIdentifier,
        }
    }
}


// Decorator
export const arrayUnique = (uniqueIdentifier?: (o: any) => any, buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new ArrayUniqueValidator(uniqueIdentifier, buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const ArrayUnique = arrayUnique;