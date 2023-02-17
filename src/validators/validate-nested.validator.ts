export const validateNested = () => {
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
        if (target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
            target.constructor.prototype["__metadata__"] = {}
        }

        if (target.constructor.prototype["__metadata__"].hasOwnProperty("class-validator") === false) {
            target.constructor.prototype["__metadata__"]["class-validator"] = {}
        }

        if (target.constructor.prototype["__metadata__"]["class-validator"].hasOwnProperty("properties") === false) {
            target.constructor.prototype["__metadata__"]["class-validator"]["properties"] = {}
        }

        if (target.constructor.prototype["__metadata__"]["class-validator"]["properties"].hasOwnProperty(propertyKey) === false) {
            target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey] = {}
        }

        target.constructor.prototype["__metadata__"]["class-validator"]["properties"][propertyKey].validateNested = true
    }
}

export const ValidateNested = validateNested;