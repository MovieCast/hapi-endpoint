'use strict';

// simulate export default { }
module.exports.default = {
    method: 'GET',
    path: '/es6',
    handler: () => ({
        message: 'Hi, this is an es6 route'
    })
};
