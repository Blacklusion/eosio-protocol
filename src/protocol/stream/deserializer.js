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
exports.EOSIOStreamDeserializer = void 0;
var stream = require("stream");
var Serialize = require('eosjs').Serialize;
var net_protocol_1 = require("../net-protocol");
var _a = require('util'), TextDecoder = _a.TextDecoder, TextEncoder = _a.TextEncoder;
/*
Deserializing stream

Transform stream which reads tokenised binary messages from the EOSIOStreamTokenizer
 */
var EOSIOStreamDeserializer = /** @class */ (function (_super) {
    __extends(EOSIOStreamDeserializer, _super);
    function EOSIOStreamDeserializer(options) {
        return _super.call(this, { readableObjectMode: true, highWaterMark: 1024 * 1024 }) || this;
    }
    EOSIOStreamDeserializer.prototype._transform = function (data, encoding, callback) {
        try {
            var msg = this.deserialize_message(data);
            if (msg) {
                // console.log(`Sending from deserializer `, msg);
                this.push(msg);
            }
            callback();
        }
        catch (e) {
            this.destroy(new Error("Failed to deserialize"));
            console.error(e);
            callback("Failed to deserialize");
        }
    };
    EOSIOStreamDeserializer.prototype.deserialize_message = function (array) {
        var sb = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder(),
            array: array
        });
        var len = sb.getUint32();
        var type = sb.get();
        var msg_types = net_protocol_1.NetProtocol.variant_types();
        var type_name = msg_types[type];
        if (typeof type_name === 'undefined') {
            throw new Error("Unknown message type \"" + type + "\" while deserializing");
        }
        return [type, type_name, net_protocol_1.NetProtocol.types.get(type_name).deserialize(sb)];
    };
    return EOSIOStreamDeserializer;
}(stream.Transform));
exports.EOSIOStreamDeserializer = EOSIOStreamDeserializer;
