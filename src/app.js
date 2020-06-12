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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_html_1 = __importDefault(require("./app.html"));
require("./styles.css");
var UpRadioPeer_1 = require("./UpRadioPeer");
var Connect_component_1 = __importDefault(require("./components/Connect/Connect.component"));
var LocalStream_component_1 = require("./components/Streams/LocalStream.component");
var RemoteStream_component_1 = require("./components/Streams/RemoteStream.component");
var ModeSwitch_component_1 = require("./components/ModeSwitch/ModeSwitch.component");
var events_1 = require("events");
var Status_1 = require("./components/Status");
var logger_1 = __importStar(require("peerjs/lib/logger"));
var ChannelEdit_component_1 = require("./components/Channel/ChannelEdit.component");
var UpRadioApi_1 = require("./UpRadioApi");
var ChannelInfo_component_1 = require("./components/Channel/ChannelInfo.component");
var HEARTBEAT_INTERVAL_SECONDS = 300;
// const HEARTBEAT_INTERVAL_SECONDS = 5;
var DEBUG_LEVEL = Number(process.env.DEBUG_LEVEL) || logger_1.LogLevel.Errors;
logger_1.default.logLevel = DEBUG_LEVEL;
window.logger = logger_1.default;
var App = /** @class */ (function () {
    function App(root, options) {
        var _this = this;
        this.events = new events_1.EventEmitter();
        this.root = root;
        this.root.innerHTML = app_html_1.default;
        this.listenSection = root.querySelector('section#listen');
        this.broadcastSection = root.querySelector('section#broadcast');
        this.nav = document.querySelector('nav');
        this.statusSection = root.querySelector('section#status');
        this.streamSection = root.querySelector('section#stream');
        this.peer = new UpRadioPeer_1.UpRadioPeer(options.peerId, options.peerStatus, DEBUG_LEVEL);
        this.peer.init();
        this.api = new UpRadioApi_1.UpRadioApi(this.peer.id);
        AppService.initComponents(this);
        AppService.initOptions(this, options);
        AppService.switchMode(this, this.mode);
        this.events.emit('status::message', { text: 'Creating session...', level: 'log' });
        this.api.init(options.sessionToken)
            .then(function () { return _this.events.emit('status::message', { text: 'Session started.', level: 'success' }); })
            .catch(function (err) {
            _this.events.emit('status::message', { text: err.message, level: 'error' });
        });
        this.heartbeat = setInterval(function () {
            _this.api.heartbeat(_this.channelEdit.channelId)
                .catch(function (err) {
                _this.channelEdit.channelStatus = ChannelEdit_component_1.UpRadioChannelStatus.invalid;
                if (err.status === 409) {
                    _this.events.emit('status::message', {
                        text: 'Channel name conflict. Please choose a different channel name.',
                        level: 'error'
                    });
                }
                else {
                    _this.events.emit('status::message', {
                        text: err.message,
                        level: 'error'
                    });
                }
            });
        }, HEARTBEAT_INTERVAL_SECONDS * 1000);
        // Handle call handoff from some incoming data connection
        this.peer.events.on('nextPeer', function (nextPeer) {
            _this.connect(nextPeer);
        });
    }
    ;
    App.prototype.onModeChange = function (event) {
        AppService.switchMode(this, event.mode);
    };
    Object.defineProperty(App.prototype, "mode", {
        get: function () {
            return this.modeSwitch.value;
        },
        set: function (mode) {
            this.modeSwitch.value = mode;
        },
        enumerable: true,
        configurable: true
    });
    App.prototype.connect = function (channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var peerId, connection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.events.emit('status::message', { text: 'Connecting...', level: 'info' });
                        this.peer.status = UpRadioPeer_1.UpRadioPeerState.RELAY;
                        this.remoteStream.getDialTone();
                        return [4 /*yield*/, this.api.channelResolve(channelName)
                                .catch(function (err) {
                                _this.events.emit('status::message', { text: err.message, level: 'error' });
                            })];
                    case 1:
                        peerId = _a.sent();
                        if (!peerId)
                            return [2 /*return*/];
                        connection = this.peer.call(peerId, this.remoteStream.dialTone);
                        connection.on('stream', function (stream) {
                            _this.events.emit('status::message', { text: 'Connected', level: 'success' });
                            _this.remoteStream.start(stream);
                        });
                        connection.on('close', function () {
                            _this.events.emit('status::message', { text: 'Broadcast stopped', level: 'info' });
                            _this.remoteStream.stop();
                        });
                        this.peer.on('call', function (call) {
                            if (_this.peer.maxConnectionsReached) {
                                UpRadioPeer_1.UpRadioPeerService.handoffConnection(_this.peer, call);
                                return;
                            }
                            UpRadioPeer_1.UpRadioPeerService.initMediaConnection(_this.peer, call);
                            call.answer(_this.remoteStream.stream);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.events.emit('status::message', { text: 'Disconnecting...', level: 'info' });
                        UpRadioPeer_1.UpRadioPeerService.closeMediaConnections(this.peer);
                        return [4 /*yield*/, this.remoteStream.stop().catch(console.error)];
                    case 1:
                        _a.sent();
                        this.peer.status = UpRadioPeer_1.UpRadioPeerState.OFF_AIR;
                        this.events.emit('status::message', { text: 'Disconnected', level: 'info' });
                        this.peer.off('call', function (call) {
                            UpRadioPeer_1.UpRadioPeerService.initMediaConnection(_this.peer, call);
                            call.answer(_this.remoteStream.stream);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.stopBroadcast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.events.emit('status::message', { text: 'Ending broadcast...', level: 'info' });
                        UpRadioPeer_1.UpRadioPeerService.closeMediaConnections(this.peer);
                        return [4 /*yield*/, this.localStream.stop()];
                    case 1:
                        _a.sent();
                        this.peer.status = UpRadioPeer_1.UpRadioPeerState.OFF_AIR;
                        this.peer.off('call', function (call) {
                            UpRadioPeer_1.UpRadioPeerService.initMediaConnection(_this.peer, call);
                            call.answer(_this.localStream.stream);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.broadcast = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.events.emit('status::message', { text: 'Starting broadcast...', level: 'info' });
                        return [4 /*yield*/, this.localStream.start()];
                    case 1:
                        _a.sent();
                        this.peer.status = UpRadioPeer_1.UpRadioPeerState.ON_AIR;
                        this.peer.on('call', function (call) {
                            if (_this.peer.maxConnectionsReached) {
                                UpRadioPeer_1.UpRadioPeerService.handoffConnection(_this.peer, call);
                                return;
                            }
                            UpRadioPeer_1.UpRadioPeerService.initMediaConnection(_this.peer, call);
                            call.answer(_this.localStream.stream);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
exports.App = App;
var AppService = /** @class */ (function () {
    function AppService() {
    }
    AppService.engageBroadcastMode = function (app) {
        UpRadioPeer_1.UpRadioPeerService.closeMediaConnections(app.peer);
        app.listenSection.classList.add('hidden');
        app.broadcastSection.classList.remove('hidden');
        app.channelEdit.show();
        app.localStream.show();
        app.channelInfo.hide();
        app.remoteStream.hide();
    };
    AppService.engageListenMode = function (app) {
        UpRadioPeer_1.UpRadioPeerService.closeMediaConnections(app.peer);
        app.listenSection.classList.remove('hidden');
        app.broadcastSection.classList.add('hidden');
        app.channelEdit.hide();
        app.localStream.hide();
        app.remoteStream.show();
    };
    AppService.initComponents = function (app) {
        app.channelEdit = new ChannelEdit_component_1.ChannelEditComponent(app.broadcastSection, app.api, app.peer);
        app.channelEdit.on('status::message', function (payload) { return app.events.emit('status::message', payload); });
        app.statusComponent = new Status_1.UpRadioStatusBar(app.statusSection, app.events);
        app.connectComponent = new Connect_component_1.default(app.nav);
        app.channelInfo = new ChannelInfo_component_1.ChannelInfo(app.listenSection);
        app.modeSwitch = new ModeSwitch_component_1.ModeSwitchComponent(app.nav);
        app.modeSwitch.on('MODE_SWITCH', app.onModeChange.bind(app));
        app.remoteStream = new RemoteStream_component_1.RemoteStreamComponent(app.streamSection);
        app.localStream = new LocalStream_component_1.LocalStreamComponent(app.streamSection);
        app.localStream.broadcastBtn.onclick = app.broadcast.bind(app);
        app.localStream.stopBroadcastingBtn.onclick = app.stopBroadcast.bind(app);
    };
    AppService.initOptions = function (app, options) {
        app.connectComponent.input.value = options.targetChannelName || null;
        app.channelEdit.name = options.channelName || null;
        app.channelEdit.description = options.channelDescription || null;
        app.channelEdit.image = options.channelImage || null;
        app.mode = options.mode || ModeSwitch_component_1.UpRadioMode.LISTEN;
        app.localStream.setSelectedDeviceId(options.audioDeviceId);
    };
    AppService.switchMode = function (app, newMode) {
        switch (newMode) {
            case ModeSwitch_component_1.UpRadioMode.LISTEN:
                AppService.engageListenMode(app);
                break;
            case ModeSwitch_component_1.UpRadioMode.BROADCAST:
                AppService.engageBroadcastMode(app);
                break;
        }
    };
    return AppService;
}());
exports.AppService = AppService;
