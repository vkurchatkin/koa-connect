import { Middleware } from "koa";
declare type ConnectMiddlewareNoCallback = (req: any, res: any) => any;
declare type ConnectMiddlewareWithCallback = (req: any, res: any, callback: (...args: any[]) => any) => any;
declare type ConnectMiddleware = ConnectMiddlewareNoCallback | ConnectMiddlewareWithCallback;
/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function
 */
declare function koaConnect(connectMiddleware: ConnectMiddleware): Middleware;
export = koaConnect;
