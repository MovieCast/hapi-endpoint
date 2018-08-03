'use strict';

const Joi = require('joi');
const Hoek = require('hoek');
const Boom = require('boom');
const Glob = require('glob');
const debug = require('debug')('hapi-endpoint');

const internals = {
    options: Joi.object({
        path: Joi.string().trim().default(`${process.cwd()}/endpoints`),
        validVersions: Joi.array().items(Joi.number().integer()).min(1).required(),
        version: Joi.number().integer().valid(Joi.ref('validVersions')).required(),
        prefix: Joi.string().trim().default('')
    }),

    getRequestedApiVersion: (request) => {

        const version = request.headers['api-version'];

        if (/^[0-9]+$/.test(version)) {
            return parseInt(version);
        }

        return null;
    },

    mapRoutes: (routes, prefix) => {

        return routes
            .map((route) => internals.prefixRoute(route, prefix))
            .filter(Boolean);
    },

    prefixRoute: (route, prefix) => {

        if (!route.path) {
            return false;
        }

        return {
            ...route,
            path: `${prefix}${route.path}`
        };
    }
};

exports.register = (server, options) => {

    debug('Setting up hapi-endpoint');

    const { error, value: settings } = Joi.validate(options, internals.options);
    Hoek.assert(!error, 'Invalid plugin options', error);

    const folders = Glob.sync(`${settings.path}/v*`);

    folders.forEach((folder) => {

        const version = folder.split('/').pop();
        if (!Hoek.contain(settings.validVersions, parseInt(version.replace('v', '')))) {
            return;
        }

        const prefixRegex = new RegExp(`^.+?${version}(.*)\/([^/]*)$`);
        debug(`[endpoint] Found version ${version}`);

        const endpoints = Glob.sync(`${folder}/**/*.js`);

        endpoints.forEach((endpoint) => {

            debug(`[endpoint][${version}] Scanning endpoint file %s`, endpoint);

            const route = require(endpoint);
            const routes = Array.isArray(route) ? route : [route];

            const prefixPath = prefixRegex.exec(endpoint)[1];
            const prefix = `${settings.prefix}/${version}${prefixPath}`;

            const prefixedRoutes = internals.mapRoutes(routes, prefix);

            if (prefixedRoutes.length > 0) {
                server.route(prefixedRoutes);
                debug(`[endpoint][${version}] Added %O`, prefixedRoutes);
            }
        });
    });


    const requestRegex = new RegExp(`^${settings.prefix}/v[0-9]`);

    server.ext('onRequest', (request, h) => {

        if (requestRegex.test(request.path)) {
            h.continue;
        }

        const version = internals.getRequestedApiVersion(request) || settings.version;
        const prefixedPath = `${settings.prefix}/v${version}`;

        if (!Hoek.contain(settings.validVersions, version)) {
            return Boom.badRequest(`Unsupported api version, valid versions are: ${settings.validVersions}`);
        }

        const route = server.match(request.method, prefixedPath + request.path.substring(settings.prefix.length));

        if (route) {
            request.setUrl(prefixedPath + request.url.path.substring(settings.prefix.length));
        }

        return h.continue;
    });

    debug('Finished setting up');
};

exports.pkg = require('../package.json');
