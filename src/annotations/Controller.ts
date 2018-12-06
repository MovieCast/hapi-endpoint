import { IControllerOptions } from "../interfaces/IControllerOptions";
import { ControlerService } from "../classes/services/ControllerService";

export function Controller(baseUrl: string): ClassDecorator
export function Controller(options: IControllerOptions): ClassDecorator
export function Controller(baseUrlOrOptions: string | IControllerOptions) {
    return (target: Object) => {
        if(typeof baseUrlOrOptions === "string") {
            ControlerService.setControllerOptions(target, { baseUrl: baseUrlOrOptions });
        } else {
            ControlerService.setControllerOptions(target, baseUrlOrOptions);
        }
    }
}