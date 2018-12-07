import { RouteOptionsAccess } from "hapi";
import { ControllerService } from "../services/ControllerService";

export function Auth(options: false | string | RouteOptionsAccess): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        ControllerService.addRouteOptions(target, propertyKey.toString(), {
            auth: options
        });
    }
}