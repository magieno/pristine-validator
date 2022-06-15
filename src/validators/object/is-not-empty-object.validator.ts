import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";

export class IsNotEmptyObjectValidator extends BaseValidator implements ValidatorInterface {
  constructor(private readonly options: { nullable?: boolean }, buildErrorMessage?: BuildErrorMessageType) {
    super(buildErrorMessage);
  }

    async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
        const errorMessage = this.generateErrorMessage("'" + property + "' must be a non-empty object",
            ConstraintErrorKeynameEnum.IsNotEmptyObject,
            value,
            property,
            target);

        // Ensures that it's an object
        if (value != null && (typeof value === 'object' || typeof value === 'function') && !Array.isArray(value)) {

            if (this.options?.nullable === true) {
                if(!Object.values(value).every(propertyValue => propertyValue === null || propertyValue === undefined)) {
                  return null
                }

                return errorMessage;
            }

            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    return null;
                }
            }

            return errorMessage;
        }

        return errorMessage;

    }
}


// Decorator
export const isNotEmptyObject = (buildErrorMessage?: BuildErrorMessageType) => {
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
        const validator = new IsNotEmptyObjectValidator(buildErrorMessage);

        addValidator(target, propertyKey, validator)
    }
}

export const IsNotEmptyObject = isNotEmptyObject;
