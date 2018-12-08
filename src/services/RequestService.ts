import { Request } from "hapi";

export class RequestService {
  static getRequestedApiVersion(request: Request, fallback?: number): number | undefined {
    const version = request.headers['api-version'];

    if (/^[0-9]+$/.test(version)) {
        return parseInt(version);
    }

    if(fallback) {
      return fallback;
    }
  }
}