import {ValidatorInterface} from "../../interfaces/validator.interface";
import {ErrorMessage} from "../../types/error-message.type";
import {addValidator} from "../../helpers/add-validator";

export class CustomValidator implements ValidatorInterface {
  constructor(private readonly validationFunction: (value: any, property: string, target: any, metadata?: any) => Promise<ErrorMessage | null>) {
  }

  async validate(value: any, property: string, target: any, metadata?: any): Promise<ErrorMessage | null> {
    return this.validationFunction(value, property, target, metadata);
  }

  public getConstraints(): any {
    return {
      validationFunction: this.validationFunction,
    }
  }
}

// Decorator
export const customValidator = (validationFunction: (value: any, property: string, target: any) => Promise<ErrorMessage | null>) => {
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
    const validator = new CustomValidator(validationFunction);

    addValidator(target, propertyKey, validator)
  }
}

// Compatibility with class-validator
export const Validate = customValidator;