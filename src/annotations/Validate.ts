import { RouteOptionsValidate } from "hapi";
import { ControllerService } from "../services/ControllerService";

export function Validate(options: RouteOptionsValidate): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        ControllerService.addRouteOptions(target, propertyKey.toString(), {
            validate: options
        });
    }
}