'use strict';

const Path = require('path');
const Glob = require('glob');
const Semver = require('semver');
const debug = require('debug')('hapi-endpoint');

const internals = {
    options: {
        path: Path.join(process.cwd(), 'endpoints'),
        prefix: '',
        version: require(`${process.cwd()}/package.json`).version
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
    const settings = Object.assign({}, internals.options, options);

    const folders = Glob.sync(`${settings.path}/v*`);

    folders.forEach((folder) => {

        const version = folder.split('/').pop();
        const prefixRegex = new RegExp(`^.+?${version}(.*)\/([^/]*)$`);
        const isServerVersion = Semver.satisfies(settings.version, version);
        debug(`[endpoint] Found version ${version}, matches server version? '${isServerVersion}'`);

        const endpoints = Glob.sync(`${folder}/**/*.js`);

        endpoints.forEach((endpoint) => {

            debug(`[endpoint][${version}] Scanning endpoint file %s`, endpoint);

            const route = require(endpoint);
            const routes = Array.isArray(route) ? route : [route];

            const prefixPath = prefixRegex.exec(endpoint)[1];
            const prefix = `${settings.prefix}/${version}${prefixPath}`;

            const prefixedRoutes = internals.mapRoutes(routes, prefix);

            // TODO: Remove this and use the onRequest hook instead
            if (isServerVersion) {
                debug(`[endpoint][${version}] Adding routes without version prefix`);
                const unVersionedPrefix = `${settings.prefix}${prefixPath}`;
                prefixedRoutes.push(...internals.mapRoutes(routes, unVersionedPrefix));
            }

            if (prefixedRoutes.length > 0) {
                server.route(prefixedRoutes);
                debug(`[endpoint][${version}] Added %O`, prefixedRoutes);
            }
        });
    });

    debug('Finished setting up');
};

exports.pkg = require('../package.json');
