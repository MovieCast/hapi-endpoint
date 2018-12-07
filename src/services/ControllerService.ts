import 'reflect-metadata';
import { merge } from 'lodash';
import { IControllerOptions } from '../interfaces/IControllerOptions';
import { IRouteOptions } from '../interfaces/IRouteOptions';
import { RouteOptions } from 'hapi';

const OPTIONS_KEY = Symbol('OPTIONS_KEY');
const ROUTES_KEY = Symbol('ROUTES_KEY');

export class ControllerService {
    static setOptions(target: Object, options: IControllerOptions) {
        Reflect.defineMetadata(OPTIONS_KEY, { ...options }, target);
    }

    static getOptions(target: Object): IControllerOptions | undefined {
        const options = Reflect.getMetadata(OPTIONS_KEY, target);

        if(options) {
            return { ...options };
        }
    }

    static setRoutes(target: Object, routes: Map<string, IRouteOptions>) {
        Reflect.defineMetadata(ROUTES_KEY, new Map(routes), target);
    }

    static getRoutes(target: Object): Map<string, IRouteOptions> | undefined {
        const routes = Reflect.getMetadata(ROUTES_KEY, target);

        if(routes) {
            return new Map(routes);
        }
    }

    static addRoute(target: Object, propertyName: string, route: IRouteOptions) {
        let routes = this.getRoutes(target);

        if(!routes) {
            routes = new Map<string, IRouteOptions>();
        }

        routes.set(propertyName, route);

        this.setRoutes(target, routes);
    }

    static addRouteOptions(target: Object, propertyName: string, options: RouteOptions) {
        let routes = this.getRoutes(target);

        if(!routes || !routes.has(propertyName)) {
            throw new Error(`@Route annotation is missing for "${propertyName}" of class "${target.constructor.name}" or annonation order is wrong.`);
        }

        const route = routes.get(propertyName);
        routes.set(propertyName, merge(route, { options }));

        this.setRoutes(target, routes);
    }
}