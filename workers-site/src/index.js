"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var _a = require('@cloudflare/kv-asset-handler'), getAssetFromKV = _a.getAssetFromKV, mapRequestToAsset = _a.mapRequestToAsset;
/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
var DEBUG = false;
var Worker = /** @class */ (function () {
    function Worker() {
    }
    Worker.handle = function (event) {
        var url = new URL(event.request.url);
        console.log(url.pathname);
        if (url.pathname.startsWith('/api')) {
            event.respondWith(api_1.UpRadioApiRouter.route(event.request));
        }
        else {
            try {
                event.respondWith(handleEvent(event));
            }
            catch (e) {
                if (DEBUG) {
                    return event.respondWith(new Response(e.message || e.toString(), {
                        status: 500,
                    }));
                }
                event.respondWith(new Response('Internal Error', { status: 500 }));
            }
        }
    };
    return Worker;
}());
exports.Worker = Worker;
self.addEventListener('fetch', Worker.handle);
function handleEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var options, e_1, notFoundResponse, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {};
                    options.mapRequestToAsset = function (req) {
                        // First let's apply the default handler, which we imported from
                        // '@cloudflare/kv-asset-handler' at the top of the file. We do
                        // this because the default handler already has logic to detect
                        // paths that should map to HTML files, for which it appends
                        // `/index.html` to the path.
                        req = mapRequestToAsset(req);
                        // Now we can detect if the default handler decided to map to
                        // index.html in some specific directory.
                        if (req.url.endsWith('/index.html')) {
                            // Indeed. Let's change it to instead map to the root `/index.html`.
                            // This avoids the need to do a redundant lookup that we know will
                            // fail.
                            return new Request(new URL(req.url).origin + "/index.html", req);
                        }
                        else {
                            // The default handler decided this is not an HTML page. It's probably
                            // an image, CSS, or JS file. Leave it as-is.
                            return req;
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 8]);
                    if (DEBUG) {
                        // customize caching
                        options.cacheControl = {
                            bypassCache: true,
                        };
                    }
                    return [4 /*yield*/, getAssetFromKV(event, options)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    if (!!DEBUG) return [3 /*break*/, 7];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, getAssetFromKV(event, {
                            mapRequestToAsset: function (req) { return new Request(new URL(req.url).origin + "/404.html", req); },
                        })];
                case 5:
                    notFoundResponse = _a.sent();
                    return [2 /*return*/, new Response(notFoundResponse.body, __assign(__assign({}, notFoundResponse), { status: 404 }))];
                case 6:
                    e_2 = _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, new Response(e_1.message || e_1.toString(), { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
// function handlePrefix(prefix: string) {
//   return (request: Request) => {
//     // compute the default (e.g. / -> index.html)
//     let defaultAssetKey = mapRequestToAsset(request)
//     let url = new URL(defaultAssetKey.url)
//     // strip the prefix from the path for lookup
//     url.pathname = url.pathname.replace(prefix, '/')
//     // inherit all other props from the default request
//     return new Request(url.toString(), defaultAssetKey)
//   }
// }
