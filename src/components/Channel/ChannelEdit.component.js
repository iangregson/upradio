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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ChannelEdit_component_html_1 = __importDefault(require("./ChannelEdit.component.html"));
var __1 = require("..");
var ChannelInfo_component_1 = require("./ChannelInfo.component");
var UpRadioChannelStatus;
(function (UpRadioChannelStatus) {
    UpRadioChannelStatus["valid"] = "VALID";
    UpRadioChannelStatus["invalid"] = "INVALID";
})(UpRadioChannelStatus = exports.UpRadioChannelStatus || (exports.UpRadioChannelStatus = {}));
var ChannelEditComponent = /** @class */ (function (_super) {
    __extends(ChannelEditComponent, _super);
    function ChannelEditComponent(parent, api, peer) {
        var _this = _super.call(this, parent, 'ChannelEditComponent', ChannelEdit_component_html_1.default) || this;
        _this.api = api;
        _this.peer = peer;
        _this.parent.classList.add('flex');
        _this.parent.classList.add('flex-col');
        _this.parent.classList.add('flex-grow');
        _this.container.classList.add('flex');
        _this.container.classList.add('flex-col');
        _this.container.classList.add('flex-grow');
        _this.nameInput = _this.container.querySelector('input#channelName');
        _this.descriptionInput = _this.container.querySelector('textarea#channelDescription');
        _this.verifyBtn = _this.container.querySelector('button#channelVerify');
        _this.verifyBtn.onclick = _this.verifyChannelName.bind(_this);
        _this.copyUrlBtn = _this.container.querySelector('button#copyUrl');
        _this.copyUrlBtn.onclick = _this.copyUrl.bind(_this);
        _this.channelEditBox = _this.container.querySelector('div#channelEditor');
        _this.channelInfoBox = _this.container.querySelector('div#channelInfo');
        _this.channelInfo = new ChannelInfo_component_1.ChannelInfo(_this.channelInfoBox);
        _this.channelInfo.init({ peerId: _this.peer.id });
        _this.channelInfo.mode = ChannelInfo_component_1.ChannelInfoMode.READ_WRITE;
        _this.channelInfo.editBtn.onclick = function () { return _this.channelEditBox.classList.toggle('hidden'); };
        _this.channelImageUpload = _this.container.querySelector('input#channelImageUpload');
        _this.channelImageUpload.onchange = function () {
            var reader = new FileReader();
            var self = _this;
            reader.addEventListener("load", function () {
                var result = this.result.toString().split(',').pop();
                self.image = result;
            }, false);
            reader.readAsDataURL(_this.channelImageUpload.files[0]);
        };
        return _this;
    }
    ChannelEditComponent.htmlEscape = function (s) {
        return s.trim()
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;');
    };
    ChannelEditComponent.toUrlSlug = function (s) {
        return encodeURIComponent(s.trim()
            .replace(/\s/g, '')
            .replace(/[.!~*'()]/g, '')
            .toLowerCase());
    };
    ChannelEditComponent.prototype.copyUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new URL(location.origin);
                        url.pathname = '/' + this.channelId;
                        return [4 /*yield*/, navigator.clipboard.writeText(url.toString())
                                .catch(console.error)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelEditComponent.prototype.verifyChannelName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.channelVerify(this.channelId)
                            .then(function () {
                            _this.channelStatus = UpRadioChannelStatus.valid;
                        })
                            .catch(function (err) {
                            _this.channelStatus = UpRadioChannelStatus.invalid;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(ChannelEditComponent.prototype, "channelStatus", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            this._status = status;
            switch (status) {
                case UpRadioChannelStatus.invalid:
                    this.nameInput.classList.add('border-red-500');
                    this.verifyBtn.classList.add('border-red-500');
                    this.emit('status::message', { text: 'Channel name invalid.', level: 'error' });
                    break;
                case UpRadioChannelStatus.valid:
                    this.nameInput.classList.add('border-green-500');
                    this.verifyBtn.classList.add('border-green-500');
                    this.emit('status::message', { text: 'Channel verified.', level: 'success' });
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelEditComponent.prototype, "name", {
        get: function () {
            return this.channelInfo.name;
        },
        set: function (name) {
            this.nameInput.value = name;
            this.channelInfo.name = ChannelEditComponent.htmlEscape(name);
            this.channelInfo.id = ChannelEditComponent.toUrlSlug(name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelEditComponent.prototype, "description", {
        get: function () {
            return this.descriptionInput.value;
        },
        set: function (description) {
            this.descriptionInput.textContent = description;
            this.channelInfo.description = ChannelEditComponent.htmlEscape(description);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelEditComponent.prototype, "image", {
        get: function () {
            return this.channelInfo.image;
        },
        set: function (imageBase64) {
            if (!imageBase64)
                return;
            this.channelInfo.image = imageBase64;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelEditComponent.prototype, "channelId", {
        get: function () {
            return this.channelInfo.id;
        },
        set: function (channelId) {
            this.channelInfo.id = ChannelEditComponent.toUrlSlug(channelId);
        },
        enumerable: true,
        configurable: true
    });
    return ChannelEditComponent;
}(__1.Component));
exports.ChannelEditComponent = ChannelEditComponent;
