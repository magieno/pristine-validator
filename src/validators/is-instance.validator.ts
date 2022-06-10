import {ValidatorInterface} from "../interfaces/validator.interface";
import {addValidator} from "../helpers/add-validator";

export class IsInstanceValidator implements ValidatorInterface {
    constructor(private readonly targetTypeConstructor: new (...args: any[]) => any) {
    }

    validate(value: any): Promise<boolean> {
        this.targetTypeConstructor && typeof this.targetTypeConstructor === 'function' && object instanceof this.targetTypeConstructor
    }

}

export const isInstance = (proerty) => {
    addValidator(new IsInstanceValidator());
}