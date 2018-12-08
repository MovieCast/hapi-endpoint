import { RouteOptionsPayload } from "hapi";
import { ControllerService } from "../services/ControllerService";

export function Payload(options: RouteOptionsPayload): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        ControllerService.addRouteOptions(target, propertyKey.toString(), {
            payload: options
        });
    }
}
