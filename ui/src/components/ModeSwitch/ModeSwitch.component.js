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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ModeSwitch_component_html_1 = __importDefault(require("./ModeSwitch.component.html"));
var __1 = require("..");
var UpRadioMode;
(function (UpRadioMode) {
    UpRadioMode["LISTEN"] = "LISTEN";
    UpRadioMode["BROADCAST"] = "BROADCAST";
})(UpRadioMode = exports.UpRadioMode || (exports.UpRadioMode = {}));
var ModeSwitchComponent = /** @class */ (function (_super) {
    __extends(ModeSwitchComponent, _super);
    function ModeSwitchComponent(container) {
        var _this = _super.call(this, container, 'ModeSwtich', ModeSwitch_component_html_1.default) || this;
        _this.broadcastInput = container.querySelector('input#UpRadioModeSwitch-Broadcast');
        _this.broadcastInput.onchange = function () {
            _this.emit('MODE_SWITCH', { mode: _this.value });
        };
        _this.listenInput = container.querySelector('input#UpRadioModeSwitch-Listen');
        _this.listenInput.onchange = function () {
            _this.emit('MODE_SWITCH', { mode: _this.value });
        };
        _this.broadcastBtn = container.querySelector('button#UpRadioModeSwitchBtn-Broadcast');
        _this.broadcastBtn.onclick = function () { return (location.href = location.origin); };
        return _this;
    }
    Object.defineProperty(ModeSwitchComponent.prototype, "value", {
        get: function () {
            if (this.broadcastInput.checked) {
                return UpRadioMode.BROADCAST;
            }
            return UpRadioMode.LISTEN;
        },
        set: function (mode) {
            this.broadcastInput.checked = mode === UpRadioMode.BROADCAST;
            this.listenInput.checked = mode === UpRadioMode.LISTEN;
            this.broadcastBtn.style.display = mode === UpRadioMode.LISTEN ? 'unset' : 'none';
            this.emit('MODE_SWITCH', { mode: mode });
        },
        enumerable: true,
        configurable: true
    });
    ModeSwitchComponent.createUpdateEvent = function (mode) {
        var updateEvent = new CustomEvent('UpRadio:MODE_SWITCH', { detail: mode, bubbles: true });
        return updateEvent;
    };
    return ModeSwitchComponent;
}(__1.Component));
exports.ModeSwitchComponent = ModeSwitchComponent;
