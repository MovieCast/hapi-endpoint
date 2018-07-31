'use strict';

module.exports = {
    method: 'GET',
    path: '/status',
    handler: () => ({
        version: 1,
        uptime: process.uptime() | 0
    })
};
