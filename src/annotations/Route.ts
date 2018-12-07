import { IRouteOptions } from "../interfaces/IRouteOptions";
import { HttpMethod } from "../enums/HttpMethod";
import { ControllerService } from "../services/ControllerService";

export function Route(options: IRouteOptions): MethodDecorator
export function Route(path: string, method: HttpMethod): MethodDecorator
export function Route(pathOrOptions: string | IRouteOptions, method?: HttpMethod) {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if(typeof pathOrOptions === "string") {
            ControllerService.addRoute(target, propertyKey.toString(), {
                method: method!,
                path: pathOrOptions,
                handler: descriptor.value
            })
        } else {
            ControllerService.addRoute(target, propertyKey.toString(), pathOrOptions);
        }
    }
}