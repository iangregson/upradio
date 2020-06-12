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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UpRadioApi_1 = require("@upradio-client/UpRadioApi");
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
var enc_utf8_1 = __importDefault(require("crypto-js/enc-utf8"));
var api_1 = require("./api");
var kvstore_1 = require("./kvstore");
var UpRadioAuthService = /** @class */ (function () {
    function UpRadioAuthService() {
    }
    UpRadioAuthService.authenticate = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var token, peerId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = req.headers.get(UpRadioApi_1.API_KEY_HEADER_NAME) || undefined;
                        if (!token) {
                            req.isAuthenticated = false;
                        }
                        return [4 /*yield*/, UpRadioAuthService.hasToken(token)];
                    case 1:
                        peerId = _a.sent();
                        if (!peerId) {
                            req.isAuthenticated = false;
                        }
                        else {
                            req.isAuthenticated = true;
                            req.peerId = peerId;
                            req.token = token;
                        }
                        if (!req.isAuthenticated) {
                            throw new api_1.UpRadioApiError(401, 'Unauthorized');
                        }
                        return [2 /*return*/, req];
                }
            });
        });
    };
    UpRadioAuthService.newToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var wordArray, utf8Token, _a, date, key, peerId, newToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wordArray = enc_base64_1.default.parse(token);
                        utf8Token = enc_utf8_1.default.stringify(wordArray);
                        _a = __read(utf8Token.split(':'), 3), date = _a[0], key = _a[1], peerId = _a[2];
                        if (!date || !key || !peerId)
                            throw new api_1.UpRadioApiError(400, 'Could not generate token from input.');
                        if (key !== PEER_KEY)
                            throw new api_1.UpRadioApiError(400, 'Could not generate token from input.');
                        newToken = enc_base64_1.default.stringify(sha256_1.default(date + peerId));
                        return [4 /*yield*/, kvstore_1.UpRadioKvStore.put(newToken, peerId)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, newToken];
                }
            });
        });
    };
    UpRadioAuthService.hasToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, kvstore_1.UpRadioKvStore.get(token)];
                    case 1:
                        t = _a.sent();
                        return [2 /*return*/, t];
                }
            });
        });
    };
    return UpRadioAuthService;
}());
exports.UpRadioAuthService = UpRadioAuthService;
