# HAPI Endpoint Plugin
[![Current Version](https://img.shields.io/npm/v/@moviecast/hapi-endpoint.svg)](https://www.npmjs.com/package/@moviecast/hapi-endpoint)

A plugin for hapi to automatically load in routes based on a file structure

## Example

```js
const Hapi = require('hapi');
const server = new Hapi.Server();

await server.register({
    plugin: require('@moviecast/hapi-endpoint'),
    options: {
        path: path.join(__dirname, 'routes')
    }
});

await server.start();

console.info(`Server started at ${server.info.url}`);

