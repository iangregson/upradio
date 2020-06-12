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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStream_component_html_1 = __importDefault(require("./LocalStream.component.html"));
var __1 = require("..");
var LevelMeter_1 = require("../LevelMeter");
var LocalStreamComponent = /** @class */ (function (_super) {
    __extends(LocalStreamComponent, _super);
    function LocalStreamComponent(container) {
        var _this = _super.call(this, container, 'LocalStream', LocalStream_component_html_1.default) || this;
        _this.broadcastBtn = _this.container.querySelector('button#BroadcastButton');
        _this.stopBroadcastingBtn = _this.container.querySelector('button#StopBroadcastingButton');
        _this.broadcastStatusText = _this.container.querySelector('span#broadcastStatus');
        _this.statusPanel = _this.container.querySelector('div#broadcastStatusPanel');
        _this.freqMeter = new LevelMeter_1.FreqMeter(_this.statusPanel);
        _this.audioInputSelect = container.querySelector('select#audioSource');
        _this.initDeviceList();
        return _this;
    }
    LocalStreamComponent.prototype.initDeviceList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, selectedDeviceId, _b, _c, audioDevice, option, selectedValueinOptions;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, UpRadioStreamService.enumerateAudioDevices()];
                    case 1:
                        _a.devices = _e.sent();
                        selectedDeviceId = this.audioInputSelect.value;
                        while (this.audioInputSelect.firstChild) {
                            this.audioInputSelect.removeChild(this.audioInputSelect.firstChild);
                        }
                        try {
                            for (_b = __values(this.devices), _c = _b.next(); !_c.done; _c = _b.next()) {
                                audioDevice = _c.value;
                                option = document.createElement('option');
                                option.value = audioDevice.deviceId;
                                option.text = audioDevice.label || "microphone " + (this.audioInputSelect.length + 1);
                                this.audioInputSelect.appendChild(option);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        selectedValueinOptions = Array.prototype.slice.call(this.audioInputSelect.childNodes)
                            .some(function (n) { return n.value === selectedDeviceId; });
                        if (selectedValueinOptions) {
                            this.audioInputSelect.value = selectedDeviceId;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LocalStreamComponent.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.stream)
                    return [2 /*return*/];
                this.stream.getTracks().forEach(function (track) {
                    track.stop();
                });
                this.freqMeter.stop();
                this.stopBroadcastingBtn.classList.toggle('hidden');
                this.broadcastBtn.classList.toggle('hidden');
                this.broadcastStatusText.classList.toggle('text-red-500');
                this.broadcastStatusText.classList.toggle('text-green-500');
                this.broadcastStatusText.innerText = 'OFF AIR';
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(LocalStreamComponent.prototype, "selectedDevice", {
        get: function () {
            var _this = this;
            if (!this.devices)
                return;
            return this.devices.find(function (d) { return d.deviceId === _this.audioInputSelect.value; });
        },
        enumerable: true,
        configurable: true
    });
    LocalStreamComponent.prototype.setSelectedDeviceId = function (id) {
        this.audioInputSelect.value = id;
    };
    LocalStreamComponent.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.stream)
                            this.stop();
                        _a = this;
                        return [4 /*yield*/, UpRadioStreamService.getAudioStream(this.selectedDevice)];
                    case 1:
                        _a.stream = _b.sent();
                        this.freqMeter.init(this.stream);
                        this.broadcastStatusText.classList.toggle('text-red-500');
                        this.broadcastStatusText.classList.toggle('text-green-500');
                        this.broadcastStatusText.innerText = 'ON AIR';
                        this.stopBroadcastingBtn.classList.toggle('hidden');
                        this.broadcastBtn.classList.toggle('hidden');
                        // In-case of proper labels becoming available
                        this.initDeviceList();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LocalStreamComponent;
}(__1.Component));
exports.LocalStreamComponent = LocalStreamComponent;
var UpRadioStreamService = /** @class */ (function () {
    function UpRadioStreamService() {
    }
    UpRadioStreamService.enumerateAudioDevices = function (w) {
        if (w === void 0) { w = window; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, w.navigator.mediaDevices.enumerateDevices()
                        .then(function (ds) { return ds.filter(function (d) { return d.kind === 'audioinput'; }); })];
            });
        });
    };
    UpRadioStreamService.getAudioStream = function (audioDevice, w) {
        if (w === void 0) { w = window; }
        return __awaiter(this, void 0, void 0, function () {
            var video, audio;
            return __generator(this, function (_a) {
                video = false;
                if (audioDevice && audioDevice.deviceId) {
                    audio = { deviceId: { exact: audioDevice.deviceId } };
                }
                else {
                    audio = true;
                }
                return [2 /*return*/, w.navigator.mediaDevices.getUserMedia({ video: video, audio: audio })];
            });
        });
    };
    return UpRadioStreamService;
}());
exports.UpRadioStreamService = UpRadioStreamService;
