import {ConstraintErrorKeynameEnum} from "../enums/constraint-error-keyname.enum";

export type ErrorMessage = {
    keyname: ConstraintErrorKeynameEnum | string,
    message: string,
};
