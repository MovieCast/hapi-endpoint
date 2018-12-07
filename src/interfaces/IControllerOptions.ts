import { RouteOptionsAccess } from "hapi";

export interface IControllerOptions {
    /**
     * The base url of this controller
     */
    baseUrl: string;

    /**
     * Override the generated version if needed
     */
    version?: number;

    /**
     * Global auth configuration for all routes in this controller
     */
    auth?: false | string | RouteOptionsAccess;
}