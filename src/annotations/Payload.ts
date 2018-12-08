import { ControllerService } from "../services/ControllerService";

export function Payload(options: object): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        ControllerService.addRouteOptions(target, propertyKey.toString(), {
            payload: options
        });
    }
}
