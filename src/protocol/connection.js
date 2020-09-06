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
exports.__esModule = true;
exports.EOSIOP2PClientConnection = void 0;
var net = require("net");
var EventEmitter = require("events");
var stream = require("stream");
var serializer_1 = require("./stream/serializer");
/*
Utility class for maintaining a single client connection, provides functionality for holding a connection and sending
data to the TCP stream
 */
var EOSIOP2PClientConnection = /** @class */ (function (_super) {
    __extends(EOSIOP2PClientConnection, _super);
    function EOSIOP2PClientConnection(_a) {
        var host = _a.host, port = _a.port, api = _a.api, debug = _a.debug;
        var _this = _super.call(this) || this;
        _this.host = host;
        _this.port = port;
        _this.client = null;
        _this._debug = debug;
        return _this;
    }
    EOSIOP2PClientConnection.prototype.debug = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (this._debug) {
            console.log.apply(console, msg);
        }
    };
    EOSIOP2PClientConnection.prototype.error = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        console.error.apply(console, msg);
    };
    EOSIOP2PClientConnection.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.client = new net.Socket();
                        _this.client.on('error', function (e) {
                            _this.emit('net_error', e);
                            reject(e);
                        });
                        var self = _this;
                        _this.client.connect(_this.port, _this.host, function () {
                            console.log('Connected to p2p');
                            self.emit('connected');
                            resolve(self.client);
                        });
                    })];
            });
        });
    };
    EOSIOP2PClientConnection.prototype.disconnect = function () {
        this.client.end();
        this.client.destroy();
        this.client = null;
    };
    EOSIOP2PClientConnection.prototype.send_message = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var sr, write_stream;
            var _this = this;
            return __generator(this, function (_a) {
                sr = new stream.Readable({ objectMode: true, read: function () { } });
                sr.push([msg.type, msg.type_name, msg]);
                write_stream = new serializer_1.EOSIOStreamSerializer({});
                sr.pipe(write_stream).on('data', function (d) {
                    _this.debug(">>> DATA TO CLIENT ", d);
                    // console.log(this.client);
                    if (_this.client) {
                        _this.client.write(d);
                    }
                    else {
                        _this.error("Not sending message because we do not have a client");
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return EOSIOP2PClientConnection;
}(EventEmitter));
exports.EOSIOP2PClientConnection = EOSIOP2PClientConnection;
