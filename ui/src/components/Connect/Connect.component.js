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
var Connect_component_html_1 = __importDefault(require("./Connect.component.html"));
var __1 = require("..");
var EConnectComponentState;
(function (EConnectComponentState) {
    EConnectComponentState["connected"] = "connected";
    EConnectComponentState["disconnected"] = "disconnected";
})(EConnectComponentState = exports.EConnectComponentState || (exports.EConnectComponentState = {}));
var ConnectComponent = /** @class */ (function (_super) {
    __extends(ConnectComponent, _super);
    function ConnectComponent(parent) {
        var _this = _super.call(this, parent, 'Connect', Connect_component_html_1.default) || this;
        _this.input = _this.container.querySelector('#ConnectInput');
        _this.connectBtn = _this.container.querySelector('button#ConnectButton');
        _this.connectBtn.onclick = function () {
            location.href = location.origin + '/' + _this.input.value;
        };
        return _this;
    }
    return ConnectComponent;
}(__1.Component));
exports.default = ConnectComponent;
