import {ValidationConstraintError} from "../types/validation-constraint-error.type";

export class ValidationError {
    target: any;
    property: string;
    value: any;
    constraints: ValidationConstraintError = {};
    children: ValidationError[] = [];

    constructor(property: string, value: any, target: any, constraints: ValidationConstraintError = {}, ) {
        this.property = property;
        this.value = value;
        this.target = target;
        this.constraints = constraints;
    }

    addChild(validationError: ValidationError) {
        this.children.push(validationError);
    }
}
