"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var auth_1 = require("./auth");
var channel_1 = require("./channel");
var kvstore_1 = require("./kvstore");
var UpRadioApiError = /** @class */ (function (_super) {
    __extends(UpRadioApiError, _super);
    function UpRadioApiError(status, message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.status = status;
        return _this;
    }
    UpRadioApiError.prototype.toResponse = function () {
        return new Response(this.message, { status: this.status });
    };
    return UpRadioApiError;
}(Error));
exports.UpRadioApiError = UpRadioApiError;
var UpRadioApiResponse = /** @class */ (function () {
    function UpRadioApiResponse() {
    }
    UpRadioApiResponse.ok = function () {
        return new Response('OK', { status: 200 });
    };
    UpRadioApiResponse.json = function (data) {
        try {
            return new Response(JSON.stringify(data), { status: 200 });
        }
        catch (_) {
            return UpRadioApiResponse.error();
        }
    };
    UpRadioApiResponse.text = function (data) {
        try {
            return new Response(data, { status: 200 });
        }
        catch (_) {
            return UpRadioApiResponse.error();
        }
    };
    UpRadioApiResponse.badRequest = function () {
        return new Response('Bad Request', { status: 400 });
    };
    UpRadioApiResponse.conflict = function () {
        return new Response('Conflict', { status: 409 });
    };
    UpRadioApiResponse.notFound = function () {
        return new Response('Not found', { status: 404 });
    };
    UpRadioApiResponse.error = function (err) {
        if (err && err instanceof UpRadioApiError) {
            return err.toResponse();
        }
        return new Response('Interval server error', { status: 500 });
    };
    return UpRadioApiResponse;
}());
exports.UpRadioApiResponse = UpRadioApiResponse;
var UpRadioApiRouter = /** @class */ (function () {
    function UpRadioApiRouter() {
    }
    UpRadioApiRouter.route = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var path, response, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = new URL(req.url).pathname;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 15, , 16]);
                        _a = path;
                        switch (_a) {
                            case '/api/login': return [3 /*break*/, 2];
                            case '/api/channel/verify': return [3 /*break*/, 4];
                            case '/api/channel/resolve': return [3 /*break*/, 7];
                            case '/api/heartbeat': return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 13];
                    case 2: return [4 /*yield*/, UpRadioApiRouter.login(req)];
                    case 3:
                        response = _b.sent();
                        return [3 /*break*/, 14];
                    case 4: return [4 /*yield*/, auth_1.UpRadioAuthService.authenticate(req)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, UpRadioApiRouter.channelVerify(req)];
                    case 6:
                        response = _b.sent();
                        return [3 /*break*/, 14];
                    case 7: return [4 /*yield*/, auth_1.UpRadioAuthService.authenticate(req)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, UpRadioApiRouter.channelResolve(req)];
                    case 9:
                        response = _b.sent();
                        return [3 /*break*/, 14];
                    case 10: return [4 /*yield*/, auth_1.UpRadioAuthService.authenticate(req)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, UpRadioApiRouter.heartbeat(req)];
                    case 12:
                        response = _b.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        response = UpRadioApiResponse.notFound();
                        return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        err_1 = _b.sent();
                        console.error(err_1);
                        response = UpRadioApiResponse.error(err_1);
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/, response];
                }
            });
        });
    };
    UpRadioApiRouter.login = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var token, payload, err_2, newToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, req.json()];
                    case 2:
                        payload = _a.sent();
                        token = payload.token;
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw new UpRadioApiError(400, 'No token provided');
                    case 4:
                        if (!token) {
                            throw new UpRadioApiError(400, 'No token provided');
                        }
                        return [4 /*yield*/, auth_1.UpRadioAuthService.newToken(token)];
                    case 5:
                        newToken = _a.sent();
                        if (!newToken || typeof newToken !== 'string') {
                            throw new Error('Problem generating token.');
                        }
                        return [2 /*return*/, UpRadioApiResponse.text(newToken)];
                }
            });
        });
    };
    UpRadioApiRouter.heartbeat = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var channelName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.json()];
                    case 1:
                        channelName = (_a.sent()).channelName;
                        if (!channelName) return [3 /*break*/, 4];
                        return [4 /*yield*/, channel_1.UpRadioChannelService.verify(channelName, req.peerId)];
                    case 2:
                        if (!(_a.sent())) {
                            return [2 /*return*/, UpRadioApiResponse.conflict()];
                        }
                        // Update the KV store to ensure ttl is extended
                        return [4 /*yield*/, kvstore_1.UpRadioKvStore.put(channelName, req.peerId)];
                    case 3:
                        // Update the KV store to ensure ttl is extended
                        _a.sent();
                        _a.label = 4;
                    case 4: 
                    // Update the KV store to ensure ttl is extended
                    return [4 /*yield*/, kvstore_1.UpRadioKvStore.put(req.token, req.peerId)];
                    case 5:
                        // Update the KV store to ensure ttl is extended
                        _a.sent();
                        return [2 /*return*/, UpRadioApiResponse.ok()];
                }
            });
        });
    };
    UpRadioApiRouter.channelResolve = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var channelName, peerId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.json()];
                    case 1:
                        channelName = (_a.sent()).channelName;
                        if (!channelName) {
                            throw new UpRadioApiError(400, 'No channel name to resolve');
                        }
                        return [4 /*yield*/, channel_1.UpRadioChannelService.resolve(channelName)];
                    case 2:
                        peerId = _a.sent();
                        if (!peerId) {
                            throw new UpRadioApiError(404, 'Channel not found.');
                        }
                        return [2 /*return*/, UpRadioApiResponse.text(peerId)];
                }
            });
        });
    };
    UpRadioApiRouter.channelVerify = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var channelName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.json()];
                    case 1:
                        channelName = (_a.sent()).channelName;
                        if (!channelName) {
                            throw new UpRadioApiError(400, 'No channel name to verify');
                        }
                        return [4 /*yield*/, channel_1.UpRadioChannelService.verify(channelName, req.peerId)];
                    case 2:
                        if (!(_a.sent())) {
                            return [2 /*return*/, UpRadioApiResponse.conflict()];
                        }
                        return [2 /*return*/, UpRadioApiResponse.ok()];
                }
            });
        });
    };
    return UpRadioApiRouter;
}());
exports.UpRadioApiRouter = UpRadioApiRouter;
