'use strict';

module.exports = {
    method: 'GET',
    path: '/status',
    handler: () => ({
        version: 2,
        uptime: process.uptime() | 0
    })
};
