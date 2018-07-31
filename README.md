# HAPI Endpoint Plugin
[![Build Status](https://travis-ci.org/MovieCast/hapi-endpoint.svg?branch=master)](https://travis-ci.org/MovieCast/hapi-endpoint)
[![Current Version](https://badge.fury.io/js/%40moviecast%2Fhapi-endpoint.svg)](https://badge.fury.io/js/%40moviecast%2Fhapi-endpoint)
[![Coverage Status](https://coveralls.io/repos/github/MovieCast/hapi-endpoint/badge.svg?branch=master)](https://coveralls.io/github/MovieCast/hapi-endpoint?branch=master)

A plugin for hapi to add versioned endpoints based on the file structure.

## What it does
`hapi-endpoint` will scan directories to find versioned endpoints. It will automatically add prefixes for the version and the directory of the route file. So if you have a file in `endpoints/v1/auth/login.js` it will automatically prefix the route with `v1/auth`.

By default `hapi-endpoint` will scan any file in `endpoints/v*`, this can be changed in the options of the plugin.

As an extra `hapi-endpoint` will also check the version of the application and add shortcuts to routes without the version in the prefix of the route. So if your api is version `1.0.0` and you have the file `endpoints/v1/auth/login.js` with path `/login` it will be prefixed with `v1/auth/login` and `/auth/login`.

## Installation
`yarn add @moviecast/hapi-endpoint` or `npm install @moviecast/hapi-endpoint --save`

## Usage
Start by adding the plugin to your existing server, an example is shown below.
```js
// src/server.js

const path = require('path');
const Hapi = require('hapi');
const server = new Hapi.Server();

(async() => {
    await server.register({
        plugin: require('@moviecast/hapi-endpoint'),
        options: {
            // The path to the endpoints directory (optional)
            path: path.join(__dirname, 'endpoints'), // Defaults to path.join(process.cwd(), 'endpoints')

            // An option to add a prefix before all your routes (optional)
            prefix: '/api', // Defaults to ''

            // The current application version (optional)
            version: '1.0.0', // Defaults to the version specified in package.json
        }
    });

    await server.start();

    console.info(`Server started at ${server.info.url}`);
})();
```

Your routes should follow the default route markup specified by hapi, an example route:
```js
// src/endpoints/v1/auth/login.js

module.exports = {
    method: 'POST',
    path: '/login',
    handler: async () => {
        // Check username and passport

        // Do more stuff

        return {
            success: true
        }
    }
}
```
