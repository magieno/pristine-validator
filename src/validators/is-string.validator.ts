import {ValidatorInterface} from "../interfaces/validator.interface";

export class IsStringValidator implements ValidatorInterface {
    validate(value: any): Promise<boolean> {
        return Promise.resolve(false);
    }

}



