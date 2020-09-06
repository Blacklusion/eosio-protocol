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
exports.EOSIOStreamTokenizer = void 0;
var stream = require("stream");
var concatenate = require('../../includes/utils').concatenate;
/*
Tokenising stream

Receives fragmented data from the tcp socket and stores it until a complete message is in the buffer and then pushes
the complete message
 */
var EOSIOStreamTokenizer = /** @class */ (function (_super) {
    __extends(EOSIOStreamTokenizer, _super);
    function EOSIOStreamTokenizer(options) {
        var _this = 
        // options.objectMode = true;
        _super.call(this, options) || this;
        _this.array = new Uint8Array();
        _this.buffer = [];
        return _this;
    }
    EOSIOStreamTokenizer.prototype._transform = function (data, encoding, callback) {
        // console.log(data);
        if (encoding !== 'buffer') {
            console.log('Received UTF8');
            // throw new Error(`Incorrect buffer encoding ${encoding}`);
        }
        this.array = concatenate(this.array, data);
        // console.log(`Stream write`, this.array.length);
        var msg_data;
        while (msg_data = this.process()) {
            this.buffer.push(msg_data);
        }
        var item;
        while (item = this.buffer.shift()) {
            // console.log('item in read buffer', item);
            this.push(item);
        }
        callback();
    };
    EOSIOStreamTokenizer.prototype._flush = function (callback) {
        callback();
    };
    EOSIOStreamTokenizer.prototype.process = function () {
        // read length of the first message
        var current_length = 0;
        for (var i = 0; i < 4; i++) {
            current_length |= this.array[i] << (i * 8);
        }
        current_length += 4;
        var msg_data = null;
        // console.log(`Processing with length ${current_length}`);
        if (current_length <= this.array.length) {
            // console.log(`Read queue ${current_length} from buffer ${this.array.length}`);
            // console.log(this.array.slice(0, current_length));
            msg_data = this.array.slice(0, current_length);
            this.array = this.array.slice(current_length);
            // console.log(`Length now ${this.array.length}`);
        }
        return msg_data;
    };
    return EOSIOStreamTokenizer;
}(stream.Transform));
exports.EOSIOStreamTokenizer = EOSIOStreamTokenizer;
