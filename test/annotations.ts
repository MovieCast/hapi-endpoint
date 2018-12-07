import * as Lab from 'lab';
import * as Hapi from 'hapi';
import { expect } from 'code';

import { ControllerService } from '../src/services';

import { AuthController } from './controllers/v1/AuthController';
import { UserController } from './controllers/v1/UserController';

const { describe, it, beforeEach } = exports.lab = Lab.script();

describe('Annotations', () => {
    
    it('should register controller options', () => {
        
        const options = ControllerService.getOptions(UserController.prototype);

        expect(options).not.to.be.undefined();
        expect(options!.auth).to.equal('jwt');
    })

    it('should register controller\'s baseUrl as options', () => {

        const options = ControllerService.getOptions(AuthController.prototype);

        expect(options).not.to.be.undefined();
        expect(options!.baseUrl).to.equal('/auth');
    });

    it('should register controller routes', () => {

        const routes = ControllerService.getRoutes(AuthController.prototype);

        expect(routes).not.to.be.undefined();
        expect(routes!.size).to.equal(2);
    });
});