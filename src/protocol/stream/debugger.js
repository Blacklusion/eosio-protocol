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
exports.EOSIOStreamConsoleDebugger = void 0;
var sha256 = require('sha256');
var stream = require("stream");
var messages_1 = require("../messages");
var dist_1 = require("eosjs/dist");
/*
Debugging stream

Writable stream which takes the object output from EOSIOStreamDeserializer and logs it to the console in a compact format
 */
var EOSIOStreamConsoleDebugger = /** @class */ (function (_super) {
    __extends(EOSIOStreamConsoleDebugger, _super);
    function EOSIOStreamConsoleDebugger(options) {
        var _this = _super.call(this, { objectMode: true }) || this;
        _this.client_identifier = '';
        _this.prefix = options.prefix || '';
        return _this;
    }
    EOSIOStreamConsoleDebugger.prototype._write = function (chunk, encoding, callback) {
        var msg = messages_1.NetMessage.from(chunk[0]);
        msg.copy(chunk[2]);
        var prefix = this.prefix + "  [" + chunk[1] + "]";
        var log_msg = '';
        switch (chunk[1]) {
            case 'handshake_message':
                log_msg = "handshake from " + chunk[2].p2p_address;
                this.client_identifier = chunk[2].p2p_address;
                break;
            case 'time_message':
                var t_msg = msg;
                log_msg = "time message dst: " + t_msg.dst + ", org: " + t_msg.org + ", rec: " + t_msg.rec + ", xmt: " + t_msg.xmt;
                break;
            case 'go_away_message':
                var ga_msg = msg;
                var reason = messages_1.GoAwayMessage.reasons[ga_msg.reason];
                log_msg = "go away message " + reason;
                break;
            case 'notice_message':
                var n_msg = msg;
                var notice_mode = messages_1.NoticeMessage.modes[n_msg.known_blocks.mode];
                // log_msg = n_msg);
                if (notice_mode === 'normal') {
                    log_msg = "notice message, remote server is " + n_msg.known_blocks.pending + " blocks ahead";
                }
                else {
                    log_msg = notice_mode + " notice message, lib : " + n_msg.known_trx.pending + ", head " + n_msg.known_blocks.pending;
                }
                break;
            case 'request_message':
                var r_msg = msg;
                log_msg = "request message";
                break;
            case 'sync_request_message':
                var sr_msg = msg;
                log_msg = "sync request message";
                break;
            case 'signed_block':
                var sb_msg = msg;
                var block_num_hex = sb_msg.previous.substr(0, 8); // first 64 bits
                var block_num = parseInt(block_num_hex, 16) + 1;
                log_msg = "#" + block_num + " signed by " + sb_msg.producer;
                break;
            case 'packed_transaction':
                var pt_msg = msg;
                var trx_bin = dist_1.Serialize.hexToUint8Array(pt_msg.packed_trx);
                var trx_id = sha256(trx_bin);
                log_msg = "Transaction " + trx_id;
                break;
        }
        if (!log_msg) {
            console.log('Unknown chunk', chunk);
        }
        else {
            console.log(prefix + " - " + this.client_identifier + " " + log_msg);
        }
        callback();
    };
    return EOSIOStreamConsoleDebugger;
}(stream.Writable));
exports.EOSIOStreamConsoleDebugger = EOSIOStreamConsoleDebugger;
