import 'reflect-metadata';
import { merge } from 'lodash';
import { IControllerOptions } from '../../interfaces/IControllerOptions';
import { IRouteOptions } from '../../interfaces/IRouteOptions';
import { string } from 'joi';
import { RouteOptions } from 'hapi';

const OPTIONS_KEY = Symbol('OPTIONS_KEY');
const ROUTES_KEY = Symbol('ROUTES_KEY');

export type RouteMap = { [key: string]: IRouteOptions };

export class ControlerService {
    static setControllerOptions(target: Object, options: IControllerOptions) {
        Reflect.defineMetadata(OPTIONS_KEY, { ...options }, target);
    }

    static getControllerOptions(target: Object): IControllerOptions | undefined {
        const options = Reflect.getMetadata(OPTIONS_KEY, target);

        if(options) {
            return { ...options };
        }
    }

    static setControllerRoutes(target: Object, routes: Map<string, IRouteOptions>) {
        Reflect.defineMetadata(ROUTES_KEY, { routes }, target);
    }

    static getControllerRoutes(target: Object): Map<string, IRouteOptions> | undefined {
        const routes = Reflect.getMetadata(ROUTES_KEY, target);

        if(routes) {
            return new Map(routes);
        }
    }

    static addControllerRoute(target: Object, propertyName: string, route: IRouteOptions) {
        let routes = this.getControllerRoutes(target);

        if(!routes) {
            routes = new Map<string, IRouteOptions>();
        }

        routes.set(propertyName, route);

        this.setControllerRoutes(target, routes);
    }

    static addControllerRouteOptions(target: Object, propertyName: string, options: RouteOptions) {
        let routes = this.getControllerRoutes(target);

        if(!routes || !routes.has(propertyName)) {
            throw new Error('Welp...');
        }

        const route = routes.get(propertyName);
        routes.set(propertyName, merge(route, { options }));

        this.setControllerRoutes(target, routes);
    }
}