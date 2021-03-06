'use strict';

const Lab = require('lab');
const Hapi = require('hapi');
const { expect } = require('code');
const { describe, it, beforeEach } = exports.lab = Lab.script();

let server;

beforeEach(async () => {

    try {
        server = Hapi.server();
        await server.start();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
});

describe('Plugin registration', () => {

    it('should fail if no options are specified', async () => {

        await expect(server.register({
            plugin: require('../lib'),
            options: {}
        })).to.reject(Error, /Invalid plugin options/);
    });

    it('should fail if validVersions is not specified', async () => {

        await expect(server.register({
            plugin: require('../lib'),
            options: {
                version: 1
            }
        })).to.reject(Error, /Invalid plugin options/);
    });

    it('should fail if validversions is an empty array', async () => {

        await expect(server.register({
            plugin: require('../lib'),
            options: {
                validVersions: [],
                version: 1
            }
        })).to.reject(Error, /Invalid plugin options/);
    });

    it('should fail if version is not specified', async () => {

        await expect(server.register({
            plugin: require('../lib'),
            options: {
                validVersions: [1]
            }
        })).to.reject(Error, /Invalid plugin options/);
    });

    it('should fail if version is not an element of validVersions', async () => {

        await expect(server.register({
            plugin: require('../lib'),
            options: {
                validVersions: [1],
                version: 2
            }
        })).to.reject(Error, /Invalid plugin options/);
    });

    it('should fail if fileExtensions is an empty array', async () => {

        await expect(server.register({
            plugin: require('../lib'),
            options: {
                validVersions: [1],
                version: 1,
                fileExtensions: []
            }
        })).to.reject(Error, /Invalid plugin options/);
    });

    it('should succeed if all options are valid', async () => {

        expect(await server.register({
            plugin: require('../lib'),
            options: {
                path: `${__dirname}/endpoints`,
                validVersions: [1, 2],
                version: 1
            }
        })).to.be.undefined();
    });
});

describe('Versioning', () => {

    beforeEach(async () => {

        await server.register({
            plugin: require('../lib'),
            options: {
                path: `${__dirname}/endpoints`,
                validVersions: [1, 2],
                version: 1
            }
        });
    });

    describe(' -> basic', () => {

        it('should prefix endpoints properly', async () => {

            const response1 = await server.inject({
                method: 'GET',
                url: '/v1/status'
            });

            expect(response1.statusCode).to.equal(200);
            expect(response1.result.version).to.equal(1);

            const response2 = await server.inject({
                method: 'GET',
                url: '/v2/status'
            });

            expect(response2.statusCode).to.equal(200);
            expect(response2.result.version).to.equal(2);
        });

        it('should not load unsupported endpoints', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/v3/status'
            });

            expect(response.statusCode).to.equal(404);
        });

        it('should not load faulty routes', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/v1/faulty/route'
            });

            expect(response.statusCode).to.equal(404);
        });

        it('should load multiple routes in one file', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/v1/multiple/route1'
            });

            expect(response.statusCode).to.equal(200);
            expect(response.result.message).to.equal('This is route 1');
        });

        it('should load routes out of an es6 module', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/v1/es6'
            });

            expect(response.statusCode).to.equal(200);
            expect(response.result.message).to.equal('Hi, this is an es6 route');
        });

    });

    describe(' -> header', () => {

        it('should fall back to the version specified in options', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/status'
            });

            expect(response.statusCode).to.equal(200);
            expect(response.result.version).to.equal(1);
        });

        it('should support the custom api-version header', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/status',
                headers: {
                    'api-version': 2
                }
            });

            expect(response.statusCode).to.equal(200);
            expect(response.result.version).to.equal(2);
        });

        it('should fail if an unsupported api-version is specified', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/status',
                headers: {
                    'api-version': 3
                }
            });

            expect(response.statusCode).to.equal(400);
        });
    });
});

describe('File Extensions', () => {

    it('should be able to load routes from different file extensions', async () => {

        await server.register({
            plugin: require('../lib'),
            options: {
                path: `${__dirname}/endpoints`,
                validVersions: [1],
                version: 1,
                fileExtensions: ['js', 'ext']
            }
        });

        const response = await server.inject({
            method: 'GET',
            url: '/file'
        });

        expect(response.statusCode).to.equal(200);
    });
});

