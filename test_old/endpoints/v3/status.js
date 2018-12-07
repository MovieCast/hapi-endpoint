'use strict';

module.exports = {
    method: 'GET',
    path: '/status',
    handler: () => ({
        version: 3,
        uptime: process.uptime() | 0
    })
};
