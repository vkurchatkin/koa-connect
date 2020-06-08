/// <reference types="node" />
import { Middleware } from 'koa';
import { IncomingMessage, ServerResponse } from 'http';
declare type ConnectMiddlewareNoCallback = (req: IncomingMessage, res: ServerResponse) => void;
declare type ConnectMiddlewareWithCallback = (req: IncomingMessage, res: ServerResponse, callback: (...args: any[]) => void) => void;
declare type ConnectMiddleware = ConnectMiddlewareNoCallback | ConnectMiddlewareWithCallback;
/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function.
 */
declare function koaConnect(connectMiddleware: ConnectMiddleware): Middleware;
export = koaConnect;
