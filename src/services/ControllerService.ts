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

    static getRoutes(target: Object): IRouteOptions[] | undefined {
        const routeMap = this.getRouteMap(target);

        if(routeMap) {
            return [ ...routeMap.values() ]
        }
    }

    static setRouteMap(target: Object, routes: Map<string, IRouteOptions>) {
        Reflect.defineMetadata(ROUTES_KEY, new Map(routes), target);
    }

    static getRouteMap(target: Object): Map<string, IRouteOptions> | undefined {
        const routes = Reflect.getMetadata(ROUTES_KEY, target);

        if(routes) {
            return new Map(routes);
        }
    }

    static addRoute(target: Object, propertyName: string, route: IRouteOptions) {
        let routes = this.getRouteMap(target);

        if(!routes) {
            routes = new Map<string, IRouteOptions>();
        }

        routes.set(propertyName, route);

        this.setRouteMap(target, routes);
    }

    static addRouteOptions(target: Object, propertyName: string, options: RouteOptions) {
        let routes = this.getRouteMap(target);

        if(!routes || !routes.has(propertyName)) {
            throw new Error(`@Route annotation is missing for "${propertyName}" of class "${target.constructor.name}" or annonation order is wrong.`);
        }

        const route = routes.get(propertyName);
        routes.set(propertyName, merge(route, { options }));

        this.setRouteMap(target, routes);
    }
}