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
var RemoteStream_component_html_1 = __importDefault(require("./RemoteStream.component.html"));
var __1 = require("..");
var LevelMeter_1 = require("../LevelMeter");
var RemoteStreamComponent = /** @class */ (function (_super) {
    __extends(RemoteStreamComponent, _super);
    function RemoteStreamComponent(container) {
        var _this = _super.call(this, container, 'RemoteStream', RemoteStream_component_html_1.default) || this;
        _this.audioOutput = container.querySelector('audio#UpRadioAudioOutput');
        _this.playBtn = container.querySelector('button#UpRadioAudioOutput-play');
        _this.playBtn.onclick = function () { return _this.audioOutput.play(); };
        _this.stopBtn = container.querySelector('button#UpRadioAudioOutput-stop');
        _this.stopBtn.onclick = function () { return _this.audioOutput.pause(); };
        _this.hideBtn(_this.stopBtn);
        _this.audioOutput.onplay = function () {
            _this.hideBtn(_this.playBtn);
            _this.showBtn(_this.stopBtn);
        };
        _this.audioOutput.onpause = function () {
            _this.hideBtn(_this.stopBtn);
            _this.showBtn(_this.playBtn);
        };
        return _this;
    }
    RemoteStreamComponent.prototype.hideBtn = function (btn) {
        btn.classList.add('hidden');
    };
    RemoteStreamComponent.prototype.showBtn = function (btn) {
        btn.classList.remove('hidden');
    };
    RemoteStreamComponent.prototype.start = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stream = stream;
                this.audioOutput.srcObject = stream;
                this.dialToneGenerator.start();
                return [2 /*return*/];
            });
        });
    };
    RemoteStreamComponent.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stream = null;
                this.audioOutput.srcObject = null;
                this.dialToneGenerator.stop();
                return [2 /*return*/];
            });
        });
    };
    RemoteStreamComponent.prototype.getDialTone = function () {
        var _a = __read(LevelMeter_1.UpRadioAudioService.createToneGeneratorAndStream(), 2), oscillator = _a[0], outputStream = _a[1];
        this.dialToneGenerator = oscillator;
        this.dialTone = outputStream.stream;
    };
    return RemoteStreamComponent;
}(__1.Component));
exports.RemoteStreamComponent = RemoteStreamComponent;
