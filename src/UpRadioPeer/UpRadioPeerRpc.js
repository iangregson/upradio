"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var UpRadioPeerRPCMessageType;
(function (UpRadioPeerRPCMessageType) {
    UpRadioPeerRPCMessageType["ack"] = "ack";
    UpRadioPeerRPCMessageType["nextPeer"] = "nextPeer";
    UpRadioPeerRPCMessageType["chat"] = "chat";
})(UpRadioPeerRPCMessageType = exports.UpRadioPeerRPCMessageType || (exports.UpRadioPeerRPCMessageType = {}));
var UpRadioPeerRpcMsg = /** @class */ (function () {
    function UpRadioPeerRpcMsg(peerId) {
        this.id = uuid_1.v4();
        this.peerId = peerId;
        this.type = UpRadioPeerRPCMessageType.ack;
        this.params = [];
    }
    UpRadioPeerRpcMsg.prototype.toJSON = function () {
        return {
            id: this.id,
            peerId: this.peerId,
            type: this.type,
            params: this.params
        };
    };
    UpRadioPeerRpcMsg.prototype.ack = function (msg) {
        this.type = UpRadioPeerRPCMessageType.ack;
        if (msg) {
            this.params = [msg.id];
        }
        return this;
    };
    UpRadioPeerRpcMsg.isAck = function (msg) {
        return msg.type === UpRadioPeerRPCMessageType.ack;
    };
    UpRadioPeerRpcMsg.prototype.nextPeer = function (nextPeerId) {
        this.type = UpRadioPeerRPCMessageType.nextPeer;
        this.params = [nextPeerId];
        return this;
    };
    return UpRadioPeerRpcMsg;
}());
exports.UpRadioPeerRpcMsg = UpRadioPeerRpcMsg;
var UpRadioPeerRpcService = /** @class */ (function () {
    function UpRadioPeerRpcService() {
    }
    UpRadioPeerRpcService.parseMessage = function (data) {
        if (!data || !data.length)
            return null;
        try {
            var parsed = JSON.parse(data);
            if (parsed.id && parsed.type) {
                return parsed;
            }
            else {
                return null;
            }
        }
        catch (_) {
            return null;
        }
    };
    UpRadioPeerRpcService.handleMessage = function (peer, msg) {
        peer.events.emit(msg.type, msg.params);
    };
    UpRadioPeerRpcService.nextPeer = function (peer, connection, nextPeerId) {
        var msg = new UpRadioPeerRpcMsg(peer.id).nextPeer(nextPeerId);
        connection.send(msg);
    };
    return UpRadioPeerRpcService;
}());
exports.UpRadioPeerRpcService = UpRadioPeerRpcService;
