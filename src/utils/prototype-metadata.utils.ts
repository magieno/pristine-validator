export class PrototypeMetadataUtils {
    static getPropertyMetadata(target:any, property: string): any {
        if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
            return {};
        }

        if(target.constructor.prototype.__metadata__.hasOwnProperty("properties") === false) {
            return {};
        }

        if(target.constructor.prototype.__metadata__.properties.hasOwnProperty(property) === false) {
            return {};
        }

        return target.constructor.prototype.__metadata__.properties[property];
    }

    static getPropertiesFromMetadata(target: any): string[] {
        if(target.constructor.prototype.hasOwnProperty("__metadata__") === false) {
            return [];
        }

        if(target.constructor.prototype.__metadata__.hasOwnProperty("properties") === false) {
            return [];
        }

        return Object.keys(target.constructor.prototype.__metadata__.properties)
    }
}