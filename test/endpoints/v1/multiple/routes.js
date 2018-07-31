'use strict';

module.exports = [{
    method: 'GET',
    path: '/route1',
    handler: () => ({
        message: 'This is route 1'
    })
},
{
    method: 'GET',
    path: '/route2',
    handler: () => ({
        message: 'This is route 2'
    })
}];
