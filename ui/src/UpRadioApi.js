"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
var enc_utf8_1 = __importDefault(require("crypto-js/enc-utf8"));
var api_1 = require("@upradio-server/api");
exports.API_KEY_HEADER_NAME = 'X-UpRadio-Api-Token';
var UpRadioApiService = /** @class */ (function () {
    function UpRadioApiService() {
    }
    UpRadioApiService.login = function (peerId) {
        return __awaiter(this, void 0, void 0, function () {
            var words, token;
            return __generator(this, function (_a) {
                words = enc_utf8_1.default.parse(Date.now() + ":" + process.env.PEER_KEY + ":" + peerId);
                token = enc_base64_1.default.stringify(words);
                return [2 /*return*/, fetch('/api/login', {
                        method: 'POST',
                        body: JSON.stringify({ token: token }),
                        headers: {
                            'Accept': 'text/html',
                            'Content-Type': 'application/json'
                        }
                    }).then(function (r) { return r.text() || null; })
                        .catch(function (_) { return null; })];
            });
        });
    };
    UpRadioApiService.channelVerify = function (token, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, fetch('/api/channel/verify', {
                        method: 'PUT',
                        body: JSON.stringify({ channelName: channelName }),
                        headers: (_a = {
                                'Accept': 'text/html',
                                'Content-Type': 'application/json'
                            },
                            _a[exports.API_KEY_HEADER_NAME] = token,
                            _a)
                    })];
            });
        });
    };
    UpRadioApiService.channelResolve = function (token, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, fetch('/api/channel/resolve', {
                        method: 'PUT',
                        body: JSON.stringify({ channelName: channelName }),
                        headers: (_a = {
                                'Accept': 'text/html',
                                'Content-Type': 'application/json'
                            },
                            _a[exports.API_KEY_HEADER_NAME] = token,
                            _a)
                    })];
            });
        });
    };
    UpRadioApiService.heartbeat = function (token, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, fetch('/api/heartbeat', {
                        method: 'PUT',
                        body: JSON.stringify({ channelName: channelName }),
                        headers: (_a = {
                                'Accept': 'text/html',
                                'Content-Type': 'application/json'
                            },
                            _a[exports.API_KEY_HEADER_NAME] = token,
                            _a)
                    })];
            });
        });
    };
    return UpRadioApiService;
}());
exports.UpRadioApiService = UpRadioApiService;
var UpRadioApi = /** @class */ (function () {
    function UpRadioApi(peerId) {
        this.peerId = peerId;
    }
    UpRadioApi.prototype.init = function (sessionToken) {
        return __awaiter(this, void 0, void 0, function () {
            var delaySeconds, retries, MAX_RETRIES, backoff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Get a valid token with exponential backoff
                        this.token = sessionToken;
                        delaySeconds = 0;
                        retries = 0;
                        MAX_RETRIES = 3;
                        backoff = function () { return new Promise(function (resolve) {
                            setTimeout(resolve, delaySeconds * 1000);
                        }); };
                        _a.label = 1;
                    case 1:
                        if (!!this.token) return [3 /*break*/, 4];
                        return [4 /*yield*/, backoff()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.login(this.peerId)];
                    case 3:
                        _a.sent();
                        if (!this.token) {
                            delaySeconds += delaySeconds === 0 ? 1 : delaySeconds;
                            retries++;
                        }
                        if (retries > MAX_RETRIES)
                            return [3 /*break*/, 4];
                        return [3 /*break*/, 1];
                    case 4:
                        if (!this.token) {
                            throw new api_1.UpRadioApiError(401, 'Could not start a session. Please check your connection.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UpRadioApi.prototype.login = function (peerId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, UpRadioApiService.login(peerId)];
                    case 1:
                        _a.token = _b.sent();
                        return [2 /*return*/, this.token];
                }
            });
        });
    };
    UpRadioApi.prototype.heartbeat = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login(this.peerId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, UpRadioApiService.heartbeat(this.token, channelName)];
                    case 3:
                        response = _a.sent();
                        if (!(!response.ok && response.status === 401)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.login(this.peerId)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, UpRadioApiService.heartbeat(this.token)];
                    case 5:
                        response = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!response.ok && response.status === 409) {
                            throw new api_1.UpRadioApiError(409, 'Channel name conflict');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UpRadioApi.prototype.channelVerify = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login(this.peerId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, UpRadioApiService.channelVerify(this.token, channelName)];
                    case 3:
                        response = _a.sent();
                        if (!(!response.ok && response.status === 401)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.login(this.peerId)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, UpRadioApiService.channelVerify(this.token, channelName)];
                    case 5:
                        response = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!response.ok && response.status === 409) {
                            throw new api_1.UpRadioApiError(409, 'Channel name conflict');
                        }
                        if (!response.ok) {
                            throw new api_1.UpRadioApiError(response.status, response.statusText);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UpRadioApi.prototype.channelResolve = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login(this.peerId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, UpRadioApiService.channelResolve(this.token, channelName)];
                    case 3:
                        response = _a.sent();
                        if (!response.ok && response.status === 404) {
                            throw new api_1.UpRadioApiError(404, 'Channel not found');
                        }
                        return [2 /*return*/, response.text()];
                }
            });
        });
    };
    return UpRadioApi;
}());
exports.UpRadioApi = UpRadioApi;
