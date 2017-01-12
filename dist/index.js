"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Inject raw response, so we can know if middleware has responsed.
 */
function makeInjectedResponse(koaCtx, /*markHandled,*/ whenEnded) {
    var res = koaCtx.res;
    res.on('close', whenEnded).on('finish', whenEnded);
    var dummyRes = Object.create(res);
    [
        'setHeader',
        'writeHead',
        'write',
        'end'
    ].forEach(function (name) {
        dummyRes[name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            res[name].apply(res, args);
            // koa2.0 initial assign statusCode to 404, reset to 200
            if (res.statusCode === 404) {
                res.statusCode = 200;
            }
            // markHandled();
        };
    });
    [
        'statusCode',
        'statusMessage'
    ].forEach(function (name) {
        dummyRes.__defineSetter__(name, function (value) {
            res[name] = value;
            // markHandled();
        });
    });
    return dummyRes;
}
/**
 * The middleware function does include the `next` callback so only resolve
 * the Promise when it's called. If it's never called, the middleware stack
 * completion will stall
 */
function handler(ctx, connectMiddleware) {
    return new Promise(function (resolve, reject) {
        // let hasHandled = false;
        // (req, res)
        var args = [
            ctx.req,
            makeInjectedResponse(ctx, 
            // () => {
            //   // hasHandled = true;
            // },
            function () {
                resolve(false);
            })
        ];
        var assumeSync = true;
        // (req, res, next) or (err, req, res, next)
        if (connectMiddleware.length >= 3) {
            args.push(function (err) {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
            assumeSync = false;
        }
        // (err, req, res, next)
        if (connectMiddleware.length >= 4) {
            args.unshift(null);
        }
        connectMiddleware.apply(void 0, args);
        /**
         * If the middleware function does not declare receiving the `next` callback
         * assume that it's synchronous.
         */
        if (assumeSync /*&& !hasHandled*/) {
            resolve(true);
        }
    });
}
/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function
 */
function koaConnect(connectMiddleware) {
    var _this = this;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var goNext, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx.respond = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handler(ctx, connectMiddleware)];
                case 2:
                    goNext = _a.sent();
                    if (goNext) {
                        ctx.respond = true;
                        return [2 /*return*/, next()];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    ctx.respond = true;
                    throw err_1;
                case 4:
                    ;
                    return [2 /*return*/];
            }
        });
    }); };
}
module.exports = koaConnect;
