import {BaseValidator} from "../base.validator";
import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {BuildErrorMessageType} from "../../types/build-error-message.type";
import {addValidator} from "../../helpers/add-validator";
import {ConstraintErrorKeynameEnum} from "../../enums/constraint-error-keyname.enum";
/**
 * Options to be passed to IsNumber decorator.
 */
export interface IsNumberOptions {
  allowNaN?: boolean;
  allowInfinity?: boolean;
  maxDecimalPlaces?: number;
}

export class IsNumberValidator extends BaseValidator implements ValidatorInterface {
  constructor(private readonly numberOptions: IsNumberOptions, buildErrorMessage?: BuildErrorMessageType) {
    super(buildErrorMessage);
  }

  async validate(value: any, property: string, target: any): Promise<ErrorMessage | null> {
    const errorMessage = this.generateErrorMessage("'" + property + "' must be a number conforming to the specified constraints.",
        ConstraintErrorKeynameEnum.IsNumber,
        value,
        property,
        target);

    if (typeof value !== 'number') {
      return errorMessage;
    }

    if (value === Infinity || value === -Infinity) {
      return this.numberOptions.allowInfinity ? null : errorMessage;
    }

    if (Number.isNaN(value)) {
      return this.numberOptions.allowNaN ? null : errorMessage;
    }

    if (this.numberOptions.maxDecimalPlaces !== undefined) {
      let decimalPlaces = 0;
      if (value % 1 !== 0) {
        decimalPlaces = value.toString().split('.')[1].length;
      }
      if (decimalPlaces > this.numberOptions.maxDecimalPlaces) {
        return errorMessage;
      }
    }

    if(Number.isFinite(value) === false) {
      return errorMessage;
    }

    return null;
  }
}

// Decorator
export const isNumber = (numberOptions: IsNumberOptions, buildErrorMessage?: BuildErrorMessageType) => {
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
    const validator = new IsNumberValidator(numberOptions, buildErrorMessage);

    addValidator(target, propertyKey, validator)
  }
}

export const IsNumber = isNumber;
