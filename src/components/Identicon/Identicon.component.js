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
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var Ideniticon = require('identicon.js');
var AVATAR_SIZE = 128;
var IdenticonComponent = /** @class */ (function (_super) {
    __extends(IdenticonComponent, _super);
    function IdenticonComponent(container) {
        var _this = _super.call(this, container, 'Connect', '<div id="UpRadioIdenticon"></div>') || this;
        _this.identiconContainer = container.querySelector('div#UpRadioIdenticon');
        return _this;
    }
    IdenticonComponent.prototype.draw = function (id) {
        var options = { size: AVATAR_SIZE, format: 'svg' };
        this.identicon = new Ideniticon(id, options).toString();
        this.identiconContainer.innerHTML = "<img class=\"rounded\" width=" + AVATAR_SIZE + " height=" + AVATAR_SIZE + " src=\"data:image/svg+xml;base64," + this.identicon + "\">";
    };
    return IdenticonComponent;
}(__1.Component));
exports.IdenticonComponent = IdenticonComponent;
