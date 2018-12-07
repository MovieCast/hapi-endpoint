import { Auth, Controller, Route, HttpMethod, Validate } from "../../../src";
import { Request, ResponseToolkit } from "hapi";
import * as Joi from "joi";

@Controller('/auth')
export class AuthController {

    @Validate({
        payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    })
    @Route('/login', HttpMethod.POST)
    async postLogin(request: Request, h: ResponseToolkit) {
        return { token: "Some token" }
    }

    @Auth('jwt')
    @Route('/user', HttpMethod.GET)
    async getUser(request: Request, h: ResponseToolkit) {
        return {
            username: "Some User"
        }
    }
}