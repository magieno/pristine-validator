export interface ValidatorInterface {
    getName(): string;
    validate(value: any, object: any, target: any): Promise<boolean>;
}