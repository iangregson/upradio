"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModeSwitch_component_1 = require("./components/ModeSwitch/ModeSwitch.component");
var UpRadioAppState = /** @class */ (function () {
    function UpRadioAppState(w) {
        if (w === void 0) { w = window; }
        this.namespace = 'UpRadioAppState';
        this.w = w;
        this._ = this.reload();
    }
    UpRadioAppState.prototype.init = function (app) {
        var _this = this;
        Object.assign(this.w, { app: app });
        // Save app state every 3 seconds
        this.udpate();
        this.interval = setInterval(function () {
            _this.udpate();
        }, 3 * 1000);
        return this;
    };
    UpRadioAppState.prototype.setTitle = function () {
        var channel = this.mode === ModeSwitch_component_1.UpRadioMode.BROADCAST
            ? this.channelName
            : this.targetChannelName;
        document.title = channel ? (channel + ' | UpRadio') : 'UpRadio';
    };
    Object.defineProperty(UpRadioAppState.prototype, "peerId", {
        get: function () {
            var id;
            try {
                var w = this.w;
                id = w.app.peer.id;
            }
            catch (_) { }
            return id || this._.peerId;
        },
        set: function (id) {
            this._.peerId = id;
            try {
                var w = this.w;
                w.app.peer.id = id;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "audioDeviceId", {
        get: function () {
            var id;
            try {
                var w = this.w;
                id = w.app.localStream.selectedDevice.deviceId;
            }
            catch (_) { }
            return id || this._.audioDeviceId;
        },
        set: function (id) {
            this._.audioDeviceId = id;
            try {
                var w = this.w;
                w.app.localStream.setSelectedDeviceId(id);
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "channelName", {
        get: function () {
            var name;
            try {
                var w = this.w;
                name = w.app.channelEdit.name;
            }
            catch (_) { }
            return name || this._.channelName;
        },
        set: function (name) {
            this._.channelName = name;
            try {
                var w = this.w;
                w.app.channelEdit.name = name;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "targetChannelName", {
        get: function () {
            var name;
            try {
                var w = this.w;
                name = w.app.connectComponent.input.value;
            }
            catch (_) { }
            return name || this._.targetChannelName;
        },
        set: function (name) {
            this._.targetChannelName = name;
            try {
                var w = this.w;
                w.app.connectComponent.input.value = name;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "channelDescription", {
        get: function () {
            var description;
            try {
                var w = this.w;
                description = w.app.channelEdit.description;
            }
            catch (_) { }
            return description || this._.channelDescription;
        },
        set: function (description) {
            this._.channelDescription = description;
            try {
                var w = this.w;
                w.app.channelEdit.description = description;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "channelImage", {
        get: function () {
            var image;
            try {
                var w = this.w;
                image = w.app.channelEdit.image;
            }
            catch (_) { }
            return image || this._.channelImage;
        },
        set: function (imageBase64) {
            this._.channelImage = imageBase64;
            try {
                var w = this.w;
                w.app.channelEdit.image = imageBase64;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "channelId", {
        get: function () {
            var id;
            try {
                var w = this.w;
                id = w.app.channelEdit.id;
            }
            catch (_) { }
            return id || this._.channelId;
        },
        set: function (id) {
            this._.channelId = id;
            try {
                var w = this.w;
                w.app.channelEdit.id = id;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "peerStatus", {
        get: function () {
            var status;
            try {
                var w = this.w;
                status = w.app.peer.status;
            }
            catch (_) { }
            return status || this._.peerStatus;
        },
        set: function (state) {
            this._.peerStatus = state;
            try {
                var w = this.w;
                w.app.peer.status = state;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "mode", {
        get: function () {
            var m;
            try {
                var w = this.w;
                m = w.app.mode;
            }
            catch (_) { }
            return m || this._.mode;
        },
        set: function (mode) {
            this._.mode = mode;
            try {
                var w = this.w;
                w.app.mode = mode;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpRadioAppState.prototype, "sessionToken", {
        get: function () {
            var token;
            try {
                var w = this.w;
                token = w.app.api.token;
            }
            catch (_) { }
            return token || this._.sessionToken;
        },
        set: function (sessionToken) {
            this._.sessionToken = sessionToken;
            try {
                var w = this.w;
                w.app.api.token = sessionToken;
            }
            catch (_) { }
        },
        enumerable: true,
        configurable: true
    });
    UpRadioAppState.prototype.toJSON = function () {
        return {
            peerId: this.peerId,
            peerStatus: this.peerStatus,
            mode: this.mode,
            audioDeviceId: this.audioDeviceId,
            channelName: this.channelName,
            targetChannelName: this.targetChannelName,
            channelDescription: this.channelDescription,
            channelImage: this.channelImage,
            sessionToken: this.sessionToken
        };
    };
    UpRadioAppState.prototype.udpate = function () {
        var w = this.w;
        var props = this.toJSON();
        var localStore = {
            channelName: props.channelName,
            channelDescription: props.channelDescription,
            channelImage: props.channelImage
        };
        var sessionStore = {
            peerId: props.peerId,
            peerStatus: props.peerStatus,
            mode: props.mode,
            audioDeviceId: props.audioDeviceId,
            targetChannelName: props.targetChannelName,
            sessionToken: props.sessionToken
        };
        w.localStorage.setItem(this.namespace, JSON.stringify(localStore));
        w.sessionStorage.setItem(this.namespace, JSON.stringify(sessionStore));
        this.setTitle();
    };
    UpRadioAppState.prototype.reload = function () {
        var savedSession;
        var savedLocal;
        try {
            savedSession = JSON.parse(this.w.sessionStorage.getItem(this.namespace)) || {};
        }
        catch (err) {
            this.w.logger.warn('Could not deserialize any existing app state from sessionStorage.');
            savedSession = {};
        }
        try {
            savedLocal = JSON.parse(this.w.localStorage.getItem(this.namespace)) || {};
        }
        catch (err) {
            this.w.logger.warn('Could not deserialize any existing app state from localStorage.');
            savedLocal = {};
        }
        this._ = {};
        this._.peerId = savedSession.peerId || null;
        this._.peerStatus = savedSession.peerStatus || null;
        this._.mode = savedSession.mode || null;
        this._.audioDeviceId = savedSession.audioDeviceId || null;
        this._.channelName = savedLocal.channelName || null;
        this._.targetChannelName = savedSession.targetChannelName || null;
        this._.channelDescription = savedLocal.channelDescription || null;
        this._.channelImage = savedLocal.channelImage || null;
        this._.sessionToken = savedSession.sessionToken || null;
        return this._;
    };
    return UpRadioAppState;
}());
exports.UpRadioAppState = UpRadioAppState;
