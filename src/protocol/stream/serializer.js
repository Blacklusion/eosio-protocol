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
exports.__esModule = true;
exports.EOSIOStreamSerializer = void 0;
var stream = require("stream");
var Serialize = require('eosjs').Serialize;
var _a = require('util'), TextDecoder = _a.TextDecoder, TextEncoder = _a.TextEncoder;
var net_protocol_1 = require("../net-protocol");
/*
Serializing stream

Receives objects representing net messages and serializes them into a binary format understandable by the EOSIO P2P
protocol.  The output from this stream can be piped directly to the tcp socket.
 */
var EOSIOStreamSerializer = /** @class */ (function (_super) {
    __extends(EOSIOStreamSerializer, _super);
    function EOSIOStreamSerializer(options) {
        return _super.call(this, { writableObjectMode: true, readableObjectMode: true }) || this;
    }
    EOSIOStreamSerializer.prototype._transform = function (data, encoding, callback) {
        try {
            // console.log(`transform`, data);
            var msg = this.serialize_message(data);
            if (msg) {
                this.push(msg);
            }
            callback();
        }
        catch (e) {
            var err_msg = "Failed to serialize " + e.message;
            this.destroy(new Error(err_msg));
            console.error(e);
            callback(err_msg);
        }
    };
    EOSIOStreamSerializer.prototype.serialize_message = function (_a) {
        var type = _a[0], type_name = _a[1], data = _a[2];
        var sb = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
        });
        // put the message into a serialbuffer
        var msg_types = net_protocol_1.NetProtocol.abi.variants[0].types;
        net_protocol_1.NetProtocol.types.get(msg_types[type]).serialize(sb, data);
        var len = sb.length;
        // console.log(`${msg_types[type]} buffer is ${len} long`);
        // Append length and msg type
        var header = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
        });
        header.pushUint32(len + 1);
        header.push(type); // message type
        var buf = Buffer.concat([Buffer.from(header.asUint8Array()), Buffer.from(sb.asUint8Array())]);
        return buf;
    };
    return EOSIOStreamSerializer;
}(stream.Transform));
exports.EOSIOStreamSerializer = EOSIOStreamSerializer;
