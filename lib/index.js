const path = require('path');
const glob = require('glob');
const semver = require('semver');
const debug = require('debug')('hapi-endpoint');

const internals = {
    options: {
        path: path.join(process.cwd(), 'endpoints'),
        prefix: '',
        version: require(`${process.cwd()}/package.json`).version
    },

    mapRoutes: (routes, prefix) => {
        return routes
            .map(route => internals.prefixRoute(route, prefix))
            .filter(Boolean);
    },

    prefixRoute: (route, prefix) => {
        if(!route.path) return false;
        return {
            ...route,
            path: `${prefix}${route.path}`
        }
    }
}

exports.register = (server, options) => {
    debug('Setting up hapi-endpoint');
    const settings = Object.assign({}, internals.options, options);

    const folders = glob.sync(`${settings.path}/v*`);

    folders.forEach(folder => {
        const version = folder.split('/').pop();
        const prefixRegex = new RegExp(`^.+?${version}(.*)\/([^/]*)$`);
        const isServerVersion = semver.satisfies(settings.version, version);
        debug(`[endpoint] Found version ${version}, matches server version? '${isServerVersion}'`);

        const endpoints = glob.sync(`${folder}/**/*.js`);

        endpoints.forEach(endpoint => {
            debug(`[endpoint][${version}] Scanning endpoint file %s`, endpoint);
            
            const route = require(endpoint);
            const routes = Array.isArray(route) ? route : [route];

            const [fullPath, prefixPath] = prefixRegex.exec(endpoint);
            const prefix = `${settings.prefix}/${version}${prefixPath}`;

            const prefixedRoutes = internals.mapRoutes(routes, prefix);

            if(isServerVersion) {
                debug(`[endpoint][${version}] Adding routes without version prefix`)
                const prefix = `${settings.prefix}${prefixPath}`;
                prefixedRoutes.push(...internals.mapRoutes(routes, prefix));
            }

            if(prefixedRoutes.length > 0) {
                server.route(prefixedRoutes);
                debug(`[endpoint][${version}] Added %O`, prefixedRoutes);
            }
        });
    });

    debug('Finished setting up');
}

exports.pkg = require('../package.json');