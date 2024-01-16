import "reflect-metadata";

export class PrototypeMetadataUtils {
    static appendToMetadata(metadataKeyname: string, metadata: any, target: any, propertyKey?: string | symbol) {
        if(propertyKey === undefined) {
            const targetElements = Reflect.getMetadata(metadataKeyname, target) ?? [];

            targetElements.push(metadata);

            Reflect.defineMetadata(metadataKeyname, targetElements, target.prototype);
        } else {
            const targetElements = Reflect.getMetadata(metadataKeyname, target, propertyKey) ?? [];

            targetElements.push(metadata);

            Reflect.defineMetadata(metadataKeyname, targetElements, target, propertyKey);
        }
    }
}