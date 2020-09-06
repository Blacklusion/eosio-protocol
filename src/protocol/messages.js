"use strict";
/*
Net protocol message types

   using net_message = static_variant<handshake_message,
                                      chain_size_message,
                                      go_away_message,
                                      time_message,
                                      notice_message,
                                      request_message,
                                      sync_request_message,
                                      signed_block,         // which = 7
                                      packed_transaction>;  // which = 8
 */
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
exports.PackedTransactionMessage = exports.SignedBlockMessage = exports.SyncRequestMessage = exports.RequestMessage = exports.NoticeMessage = exports.TimeMessage = exports.GoAwayMessage = exports.ChainSizeMessage = exports.HandshakeMessage = exports.NetMessage = void 0;
var OrderedChecksum = /** @class */ (function () {
    function OrderedChecksum() {
    }
    return OrderedChecksum;
}());
var NetMessage = /** @class */ (function () {
    function NetMessage() {
        this.type_name = '';
        this.type = -1;
    }
    NetMessage.prototype.copy = function (data) {
        for (var p in data) {
            this[p] = data[p];
        }
    };
    NetMessage.from = function (type) {
        switch (type) {
            case 0:
                return new HandshakeMessage();
                break;
            case 1:
                return new ChainSizeMessage();
                break;
            case 2:
                return new GoAwayMessage();
                break;
            case 3:
                return new TimeMessage();
                break;
            case 4:
                return new NoticeMessage();
                break;
            case 5:
                return new RequestMessage();
                break;
            case 6:
                return new SyncRequestMessage();
                break;
            case 7:
                return new SignedBlockMessage();
                break;
            case 8:
                return new PackedTransactionMessage();
                break;
            default:
                throw new Error("Unknown message type " + type);
        }
    };
    return NetMessage;
}());
exports.NetMessage = NetMessage;
var HandshakeMessage = /** @class */ (function (_super) {
    __extends(HandshakeMessage, _super);
    function HandshakeMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'handshake_message';
        _this.type = 0;
        return _this;
    }
    return HandshakeMessage;
}(NetMessage));
exports.HandshakeMessage = HandshakeMessage;
var ChainSizeMessage = /** @class */ (function (_super) {
    __extends(ChainSizeMessage, _super);
    function ChainSizeMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'chain_size_message';
        _this.type = 1;
        return _this;
    }
    return ChainSizeMessage;
}(NetMessage));
exports.ChainSizeMessage = ChainSizeMessage;
var GoAwayMessage = /** @class */ (function (_super) {
    __extends(GoAwayMessage, _super);
    function GoAwayMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'go_away_message';
        _this.type = 2;
        return _this;
    }
    GoAwayMessage.reasons = [
        'no reason',
        'self connect',
        'duplicate',
        'wrong chain',
        'wrong version',
        'chain is forked',
        'unlinkable block received',
        'bad transaction',
        'invalid block',
        'authentication failure',
        'some other failure',
        'some other non-fatal condition'
    ];
    return GoAwayMessage;
}(NetMessage));
exports.GoAwayMessage = GoAwayMessage;
var TimeMessage = /** @class */ (function (_super) {
    __extends(TimeMessage, _super);
    function TimeMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'time_message';
        _this.type = 3;
        return _this;
    }
    return TimeMessage;
}(NetMessage));
exports.TimeMessage = TimeMessage;
var NoticeMessage = /** @class */ (function (_super) {
    __extends(NoticeMessage, _super);
    function NoticeMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'notice_message';
        _this.type = 4;
        return _this;
    }
    NoticeMessage.modes = [
        'none',
        'catch up',
        'lib catch up',
        'normal'
    ];
    return NoticeMessage;
}(NetMessage));
exports.NoticeMessage = NoticeMessage;
var RequestMessage = /** @class */ (function (_super) {
    __extends(RequestMessage, _super);
    function RequestMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'request_message';
        _this.type = 5;
        return _this;
    }
    return RequestMessage;
}(NetMessage));
exports.RequestMessage = RequestMessage;
var SyncRequestMessage = /** @class */ (function (_super) {
    __extends(SyncRequestMessage, _super);
    function SyncRequestMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'sync_request_message';
        _this.type = 6;
        return _this;
    }
    return SyncRequestMessage;
}(NetMessage));
exports.SyncRequestMessage = SyncRequestMessage;
var SignedBlockMessage = /** @class */ (function (_super) {
    __extends(SignedBlockMessage, _super);
    function SignedBlockMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'signed_block';
        _this.type = 7;
        return _this;
    }
    return SignedBlockMessage;
}(NetMessage));
exports.SignedBlockMessage = SignedBlockMessage;
var PackedTransactionMessage = /** @class */ (function (_super) {
    __extends(PackedTransactionMessage, _super);
    function PackedTransactionMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type_name = 'packed_transaction';
        _this.type = 8;
        return _this;
    }
    return PackedTransactionMessage;
}(NetMessage));
exports.PackedTransactionMessage = PackedTransactionMessage;
