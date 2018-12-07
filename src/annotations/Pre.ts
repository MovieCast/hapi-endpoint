import { RouteOptionsPreArray } from "hapi";
import { ControllerService } from "../services/ControllerService";

export function Pre(options: RouteOptionsPreArray): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        ControllerService.addRouteOptions(target, propertyKey.toString(), {
            pre: options
        });
    }
}