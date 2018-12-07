import { IControllerOptions } from "../interfaces/IControllerOptions";
import { ControllerService } from "../services/ControllerService";

export function Controller(baseUrl: string): ClassDecorator
export function Controller(options: IControllerOptions): ClassDecorator
export function Controller(baseUrlOrOptions: string | IControllerOptions) {
    return (target: Function) => {
        if(typeof baseUrlOrOptions === "string") {
            ControllerService.setOptions(target.prototype, { baseUrl: baseUrlOrOptions });
        } else {
            ControllerService.setOptions(target.prototype, baseUrlOrOptions);
        }
    }
}