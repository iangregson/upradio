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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(parent, id, template) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.id = id;
        _this.container = document.createElement('div');
        _this.container.id = id;
        _this.container.classList.add('upradio-component');
        _this.container.innerHTML = template;
        _this.parent.appendChild(_this.container);
        return _this;
    }
    Component.prototype.show = function () {
        this.container.hidden = false;
        this.container.classList.remove('hidden');
    };
    Component.prototype.hide = function () {
        this.container.hidden = true;
        this.container.classList.add('hidden');
    };
    return Component;
}(events_1.EventEmitter));
exports.Component = Component;
__export(require("./Connect"));
__export(require("./ModeSwitch"));
__export(require("./Streams"));
