import * as Glob from 'glob';
import * as _ from 'lodash';
import { merge } from 'lodash';
import { ServerRoute, RouteOptions } from 'hapi';
import { ControllerService } from "./ControllerService";
import { IRouteOptions, IControllerOptions, IEndpointPluginOptions } from '../interfaces';

export class EndpointService {
  static getEndpoints(settings: IEndpointPluginOptions) {
    const ext = settings.fileExtensions!.length > 1 ?
      `{${settings.fileExtensions!.join(',')}}` : settings.fileExtensions![0];

    return _.chain(Glob.sync(`${settings.path}/v*`))
        .flatMap(folder => this.getEndpointRoutes(folder, ext))
        .value();
  }

  static getEndpointRoutes(folder: string, ext: string): ServerRoute[] {

    const version = folder.split('/').pop() as string;

    return _.chain(Glob.sync(`${folder}/**/*.${ext}`))
        .map(fullPath => {
            const module = require(fullPath);
            return module.default as Function;
        })
        .filter(controller => controller != null)
        .flatMap(controller => this.resolveControllerRoutes(version, controller))
        .value()
  }

  static resolveControllerRoutes(version: string, controller: Function): ServerRoute[] {
    const options = ControllerService.getOptions(controller.prototype);

    if(!options) return [];

    const routes = ControllerService.getRoutes(controller.prototype);

    if(!routes || routes.length == 0) return [];

    const resolvedVersion = this.resolveControllerVersion(version, options);
    return routes.map(route => merge<ServerRoute, Partial<ServerRoute>>(this.resolveControllerRoute(route), {
      path: `/${resolvedVersion}/${options.baseUrl}${route.path}`,
      options: {
        auth: this.resolveRouteOptions(route)!.auth || options.auth
      }
    }));
  }

  static resolveControllerVersion(version: string, options: IControllerOptions): string {
    return options.version ? `v${version}` : version;
  }

  static resolveControllerRoute(route: IRouteOptions): ServerRoute {
    // Currently no action needed.
    return route;
  }

  static resolveRouteOptions(route: ServerRoute): RouteOptions {
    if(route.options) {
      // TODO: Pass in server instead of any!!
      return typeof route.options === "object" ? route.options : route.options(null as any);
    }

    return {};
  }
}