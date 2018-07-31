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

    it('should register properly', async () => {

        expect(await server.register({
            plugin: require('../lib')
        })).to.be.undefined();
    });
});

describe('Versioning', () => {

    describe(' -> version 1 default', () => {

        beforeEach(async () => {

            await server.register({
                plugin: require('../lib'),
                options: {
                    path: `${__dirname}/endpoints`,
                    version: '1.0.0'
                }
            });
        });

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

        it('should make v1 endpoints default', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/status'
            });

            expect(response.statusCode).to.equal(200);
            expect(response.result.version).to.equal(1);
        });
    });

    describe(' -> version 2 default', () => {

        beforeEach(async () => {

            await server.register({
                plugin: require('../lib'),
                options: {
                    path: `${__dirname}/endpoints`,
                    version: '2.0.0'
                }
            });
        });

        it('should make v2 endpoints default', async () => {

            const response = await server.inject({
                method: 'GET',
                url: '/status'
            });

            expect(response.statusCode).to.equal(200);
            expect(response.result.version).to.equal(2);
        });
    });
});

