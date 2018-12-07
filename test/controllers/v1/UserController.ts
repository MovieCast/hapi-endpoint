import { Controller, Route, HttpMethod, Validate } from "../../../src";
import { Request } from "hapi";
import * as Joi from "joi";

@Controller({
    baseUrl: '/user',
    auth: 'jwt'
})
export class UserController {
    @Route('/details', HttpMethod.GET)
    async getDetails(request: Request) {
        return {
            name: "Some Name"
        }
    }

    @Validate({
        payload: Joi.object({
            name: Joi.string()
        })
    })
    @Route('/details', HttpMethod.POST)
    async postDetails(request: Request) {
        return request.payload;
    }
}