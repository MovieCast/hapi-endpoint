import { IRouteOptions } from "../interfaces/IRouteOptions";
import { HttpMethod } from "../enums/HttpMethod";
import { ControlerService } from "../classes/services/ControllerService";

export function Route(options: IRouteOptions): MethodDecorator
export function Route(path: string, method: HttpMethod): MethodDecorator
export function Route(pathOrOptions: string | IRouteOptions, method?: HttpMethod) {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if(typeof pathOrOptions === "string") {
            ControlerService.addControllerRoute(target, propertyKey.toString(), {
                method: method!,
                path: pathOrOptions,
                handler: descriptor.value
            })
        } else {
            ControlerService.addControllerRoute(target, propertyKey.toString(), pathOrOptions);
        }
    }
}