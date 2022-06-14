import {ConstraintErrorKeynameEnum} from "../enums/constraint-error-keyname.enum";

export type ErrorMessage = {
    keyname: ConstraintErrorKeynameEnum,
    message: string,
};
