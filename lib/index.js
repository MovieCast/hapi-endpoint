const path = require('path');
const file = require('file');

const internals = {
    options: {
        path: path.join(process.cwd(), 'endpoints'),
        extensions: ['.js']
    },

    addRoute: (server, folder, route) => {
        if(!route.path) return;
    
        let prefix = folder.split(path.sep).pop();
        if(prefix !== 'routes')
            route.path = `/${prefix}${route.path}`;
    
        server.route(route);
    }
}

exports.register = (server, options, next) => {
    const settings = Object.assign({}. internals.options, options);

    file.walkSync(settings.path, (folder, innerFolders, files) => {
        for (let file of files) {
            // Not a supported file extension, skip.
            if (settings.extensions.indexOf(path.extname(file)) == -1) continue;

            // Check if the file is really a route...
            let route = require(path.join(folder, file));

            // Check if we have multiple routes in one file, yus this is possible.
            if(route instanceof Array) {
                for(let r of route) {
                    internals.addRoute(server, folder, r);
                }
            } else {
                internals.addRoute(server, folder, route);
            }
        }
    });
    next();
}

exports.pkg = require('../package.json');