"use strict";
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
var peerjs_1 = __importDefault(require("peerjs"));
var uuid_1 = require("uuid");
var events_1 = __importDefault(require("events"));
var UpRadioPeerRpc_1 = require("./UpRadioPeerRpc");
exports.MAX_CONNECTIONS = Number(process.env.MAX_CONNECTIONS) || 1;
var UpRadioPeerState;
(function (UpRadioPeerState) {
    UpRadioPeerState["OFF_AIR"] = "OFF_AIR";
    UpRadioPeerState["ON_AIR"] = "ON_AIR";
    UpRadioPeerState["RELAY"] = "RELAY";
})(UpRadioPeerState = exports.UpRadioPeerState || (exports.UpRadioPeerState = {}));
var UpRadioPeer = /** @class */ (function () {
    function UpRadioPeer(id, status, debug) {
        if (debug === void 0) { debug = 3; }
        this.events = new events_1.default();
        this.id = id || uuid_1.v4();
        this.status = status || UpRadioPeerState.OFF_AIR;
        this.peer = new peerjs_1.default(this.id, {
            debug: debug,
            host: 'upradio.herokuapp.com',
            port: 443,
            secure: true,
            path: '/peer-server',
            key: process.env.PEER_KEY
        });
        this.dataConnections = new Map();
        this.mediaConnections = new Map();
        return this;
    }
    Object.defineProperty(UpRadioPeer.prototype, "maxConnectionsReached", {
        get: function () {
            return this.mediaConnections.size === exports.MAX_CONNECTIONS;
        },
        enumerable: true,
        configurable: true
    });
    UpRadioPeer.prototype.init = function () {
        UpRadioPeerService.init(this);
    };
    UpRadioPeer.prototype.connect = function (id) {
        var connection = this.peer.connect(id);
        UpRadioPeerService.initDataConnection(this, connection);
        return connection;
    };
    UpRadioPeer.prototype.reconnect = function () {
        this.peer.reconnect();
    };
    UpRadioPeer.prototype.call = function (id, stream) {
        UpRadioPeerService.closeMediaConnections(this);
        var connection = this.peer.call(id, stream);
        UpRadioPeerService.initMediaConnection(this, connection);
        return connection;
    };
    UpRadioPeer.prototype.on = function (event, callback) {
        this.peer.on(event, callback);
    };
    UpRadioPeer.prototype.off = function (event, callback) {
        this.peer.off(event, callback);
    };
    return UpRadioPeer;
}());
exports.UpRadioPeer = UpRadioPeer;
var UpRadioPeerService = /** @class */ (function () {
    function UpRadioPeerService() {
    }
    UpRadioPeerService.init = function (peer) {
        peer.on('open', function () {
            // Workaround for peer.reconnect deleting previous id
            if (peer.peer.id === null) {
                peer.peer.id = peer.id;
            }
        });
        peer.on('connection', function (connection) {
            UpRadioPeerService.initDataConnection(peer, connection);
        });
        peer.on('disconnected', function () {
            console.log('Connection lost. Please reconnect');
            // Workaround for peer.reconnect deleting previous id
            peer.reconnect();
        });
        peer.on('close', function () {
            peer.dataConnections.clear();
            peer.mediaConnections.clear();
            console.log('Connection destroyed. Please refresh');
        });
        peer.on('error', function (err) {
            console.error('UpradioPeerError: ', err);
        });
    };
    UpRadioPeerService.initMediaConnection = function (peer, connection) {
        console.log('MediaConnection with ' + connection.peer);
        connection.on('close', function () {
            console.log('MediaConnection closed on peer id ' + connection.peer);
            peer.mediaConnections.delete(connection.peer);
        });
        connection.on('error', function (err) {
            console.error('MediaConnectionError for peer id ' + connection.peer, err);
        });
        peer.mediaConnections.set(connection.peer, connection);
    };
    UpRadioPeerService.initDataConnection = function (peer, connection) {
        console.log('DataConnection with ' + connection.peer);
        connection.on('close', function () {
            console.log('DataConnection closed on peer id ' + connection.peer);
            peer.dataConnections.delete(connection.peer);
        });
        connection.on('error', function (err) {
            console.error('DataConnectionError for peer id ' + connection.peer, err);
        });
        connection.on('data', function (data) {
            var msg = UpRadioPeerRpc_1.UpRadioPeerRpcService.parseMessage(data);
            if (!msg)
                return;
            UpRadioPeerRpc_1.UpRadioPeerRpcService.handleMessage(peer, msg);
        });
        peer.dataConnections.set(connection.peer, connection);
    };
    UpRadioPeerService.closeAllConnections = function (peer) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(peer.dataConnections.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var entry = _d.value;
                var connection = entry[1];
                connection.close();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(peer.mediaConnections.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var entry = _f.value;
                var connection = entry[1];
                connection.close();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    UpRadioPeerService.closeMediaConnections = function (peer) {
        var e_3, _a;
        try {
            for (var _b = __values(peer.mediaConnections.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                var connection = entry[1];
                connection.close();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    UpRadioPeerService.closeDataConnections = function (peer) {
        var e_4, _a;
        try {
            for (var _b = __values(peer.dataConnections.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                var connection = entry[1];
                connection.close();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    UpRadioPeerService.handoffConnection = function (peer, call) {
        var nextPeer = Array.from(peer.mediaConnections.values()).pop();
        if (!nextPeer) {
            throw new Error('Unable to handoff connection: no nextPeer available');
        }
        var connection = peer.connect(call.peer);
        connection.on('open', function () {
            UpRadioPeerRpc_1.UpRadioPeerRpcService.nextPeer(peer, connection, nextPeer.peer);
            connection.on('data', function (data) {
                var msg = UpRadioPeerRpc_1.UpRadioPeerRpcService.parseMessage(data);
                if (!msg)
                    return;
                if (UpRadioPeerRpc_1.UpRadioPeerRpcMsg.isAck(msg))
                    connection.close();
            });
        });
    };
    return UpRadioPeerService;
}());
exports.UpRadioPeerService = UpRadioPeerService;
