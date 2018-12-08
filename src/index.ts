export { Auth, Controller, Pre, Route, Validate } from './annotations';
export { IEndpointPluginOptions, IControllerOptions, IRouteOptions } from './interfaces';
export { HttpMethod } from './enums';

import { Server, Plugin } from "hapi";
import { IEndpointPluginOptions } from "./interfaces";

import pkg from "../package.json";
import { EndpointService } from "./services";

export default <Plugin<IEndpointPluginOptions>> {
    register: async (server: Server, options: IEndpointPluginOptions) => {
        server.route(EndpointService.getEndpoints(options));

        server.ext('onRequest', (request, h) => {
            // if (requestRegex.test(request.path)) {
            //     h.continue;
            // }

            // const version = internals.getRequestedApiVersion(request) || settings.version;
            // const prefixedPath = `${settings.prefix}/v${version}`;

            // if (!Hoek.contain(settings.validVersions, version)) {
            //     return Boom.badRequest(`Unsupported api version, valid versions are: ${settings.validVersions}`);
            // }

            // const route = server.match(request.method, prefixedPath + request.path.substring(settings.prefix.length));

            // if (route) {
            //     request.setUrl(prefixedPath + request.url.path.substring(settings.prefix.length));
            // }
            // TODO...

            return h.continue;
        });
    },
    pkg
}