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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var deserializer_1 = require("./protocol/stream/deserializer");
var tokenizer_1 = require("./protocol/stream/tokenizer");
var debugger_1 = require("./protocol/stream/debugger");
var connection_1 = require("./protocol/connection");
var messages_1 = require("./protocol/messages");
var fs = require("fs");
var utils_1 = require("./includes/utils");
var pron = require("./includes/pron");
var node_config_1 = require("./node-config");
var fetch = require('node-fetch');
var TestRunner = /** @class */ (function () {
    function TestRunner(node) {
        this.node = node;
        this.last_block_time = BigInt(0);
        this.block_count = 0;
        this.killed = false;
        this.killed_reason = '';
        this.killed_detail = '';
        this.latencies = [];
        this.block_timeout = 10000;
        var p2p = new connection_1.EOSIOP2PClientConnection(__assign(__assign({}, this.node), { debug: debug }));
        this.p2p = p2p;
    }
    TestRunner.prototype.run = function (debug) {
        if (debug === void 0) { debug = false; }
        console.log("Test runner doesnt override run");
    };
    TestRunner.prototype.send_handshake = function (override) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = new messages_1.HandshakeMessage();
                        msg.copy({
                            "network_version": 1206,
                            "chain_id": '0000000000000000000000000000000000000000000000000000000000000000',
                            "node_id": '0585cab37823404b8c82d6fcc66c4faf20b0f81b2483b2b0f186dd47a1230fdc',
                            "key": 'PUB_K1_11111111111111111111111111111111149Mr2R',
                            "time": '1574986199433946000',
                            "token": '0000000000000000000000000000000000000000000000000000000000000000',
                            "sig": 'SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne',
                            "p2p_address": "eosdac-p2p-client:9876 - a6f45b4",
                            "last_irreversible_block_num": 0,
                            "last_irreversible_block_id": '0000000000000000000000000000000000000000000000000000000000000000',
                            "head_num": 0,
                            "head_id": '0000000000000000000000000000000000000000000000000000000000000000',
                            "os": 'linux',
                            "agent": 'Dream Ghost',
                            "generation": 1
                        });
                        if (override) {
                            msg.copy(override);
                        }
                        return [4 /*yield*/, this.p2p.send_message(msg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TestRunner;
}());
var BlockTransmissionTestRunner = /** @class */ (function (_super) {
    __extends(BlockTransmissionTestRunner, _super);
    function BlockTransmissionTestRunner(node) {
        return _super.call(this, node) || this;
    }
    BlockTransmissionTestRunner.prototype.on_signed_block = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var block_num_hex, block_num, tm, latency;
            return __generator(this, function (_a) {
                // console.log('TestRunner:on_signed_block');
                clearTimeout(this.kill_timer);
                this.kill_timer = setTimeout(this.kill.bind(this), this.block_timeout);
                this.block_count++;
                block_num_hex = msg.previous.substr(0, 8);
                block_num = parseInt(block_num_hex, 16) + 1;
                tm = process.hrtime.bigint();
                if (this.last_block_time > 0) {
                    latency = Number(tm - this.last_block_time);
                    this.latencies.push(latency);
                    // console.log(`Received block : ${block_num} signed by ${msg.producer} with latency ${latency} - ${this.block_count} received from ${this.node.host}`);
                }
                this.last_block_time = tm;
                return [2 /*return*/];
            });
        });
    };
    BlockTransmissionTestRunner.prototype.on_error = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // console.error(`Received error`, e);
                this.killed = true;
                this.killed_reason = e.code;
                this.killed_detail = (e + '').replace('Error: ', '');
                return [2 /*return*/];
            });
        });
    };
    BlockTransmissionTestRunner.prototype.log_results = function (results) {
        console.log(results);
    };
    BlockTransmissionTestRunner.prototype.run = function (debug) {
        if (debug === void 0) { debug = false; }
        return __awaiter(this, void 0, void 0, function () {
            var num_blocks, p2p, client, deserialized_stream, res, info, prev_info, override, msg, e_1, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.kill_timer = setTimeout(this.kill.bind(this), this.block_timeout);
                        num_blocks = 5000;
                        p2p = this.p2p;
                        p2p.on('net_error', function (e) {
                            _this.killed = true;
                            _this.killed_reason = 'net_error';
                            _this.killed_detail = e.message;
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, p2p.connect()];
                    case 2:
                        client = _a.sent();
                        deserialized_stream = client
                            .pipe(new tokenizer_1.EOSIOStreamTokenizer({}))
                            .pipe(new deserializer_1.EOSIOStreamDeserializer({}))
                            .on('data', function (obj) {
                            if (obj[0] === 7) {
                                // console.log(`Received block `);
                                _this.on_signed_block(obj[2]);
                            }
                            if (obj[0] === 2) {
                                // console.log(`Received block `);
                                // this.on_signed_block(obj[2]);
                                _this.killed = true;
                                _this.killed_reason = 'go_away';
                                _this.killed_detail = "Received go away message " + messages_1.GoAwayMessage.reasons[obj[2].reason];
                            }
                        });
                        if (debug) {
                            deserialized_stream
                                .pipe(new debugger_1.EOSIOStreamConsoleDebugger({ prefix: '<<<' }));
                        }
                        return [4 /*yield*/, fetch(this.node.api + "/v1/chain/get_info")];
                    case 3:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 4:
                        info = _a.sent();
                        return [4 /*yield*/, this.get_prev_info(info, num_blocks)];
                    case 5:
                        prev_info = _a.sent();
                        override = {
                            chain_id: info.chain_id,
                            p2p_address: "dreamghost::" + pron[0] + " - a6f45b4",
                            last_irreversible_block_num: prev_info.last_irreversible_block_num,
                            last_irreversible_block_id: prev_info.last_irreversible_block_id,
                            head_num: prev_info.head_block_num,
                            head_id: prev_info.head_block_id
                        };
                        return [4 /*yield*/, this.send_handshake(override)];
                    case 6:
                        _a.sent();
                        msg = new messages_1.SyncRequestMessage();
                        msg.start_block = prev_info.last_irreversible_block_num;
                        msg.end_block = prev_info.last_irreversible_block_num + num_blocks;
                        return [4 /*yield*/, p2p.send_message(msg)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [4 /*yield*/, this.wait_for_tests(num_blocks)];
                    case 10:
                        results = _a.sent();
                        p2p.disconnect();
                        return [2 /*return*/];
                }
            });
        });
    };
    BlockTransmissionTestRunner.prototype.get_block_id = function (block_num_or_id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.node.api + "/v1/chain/get_block", {
                            method: 'POST',
                            body: JSON.stringify({ block_num_or_id: block_num_or_id })
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        info = _a.sent();
                        return [2 /*return*/, info.id];
                }
            });
        });
    };
    BlockTransmissionTestRunner.prototype.get_prev_info = function (info, num) {
        if (num === void 0) { num = 1000; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(num > 0)) return [3 /*break*/, 3];
                        info.head_block_num -= num;
                        info.last_irreversible_block_num -= num;
                        _a = info;
                        return [4 /*yield*/, this.get_block_id(info.head_block_num)];
                    case 1:
                        _a.head_block_id = _c.sent();
                        _b = info;
                        return [4 /*yield*/, this.get_block_id(info.last_irreversible_block_num)];
                    case 2:
                        _b.last_irreversible_block_id = _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, info];
                }
            });
        });
    };
    BlockTransmissionTestRunner.prototype.get_result_json = function () {
        return __awaiter(this, void 0, void 0, function () {
            var raw, avg, sum, sum_b, ns_divisor, total_time, blocks_per_ns, speed, results;
            return __generator(this, function (_a) {
                raw = {
                    status: 'success',
                    block_count: this.block_count,
                    latencies: this.latencies,
                    error_code: this.killed_reason,
                    error_detail: this.killed_detail
                };
                raw.status = (!this.killed_reason) ? 'success' : 'error';
                avg = 0;
                sum = 0;
                sum_b = BigInt(0);
                if (raw.latencies.length > 0) {
                    sum = raw.latencies.reduce(function (previous, current) { return current += previous; });
                    sum_b = BigInt(sum_b);
                    avg = sum / raw.latencies.length;
                }
                ns_divisor = Math.pow(10, 9);
                total_time = sum / ns_divisor;
                blocks_per_ns = raw.block_count / sum;
                speed = (blocks_per_ns * ns_divisor).toFixed(10);
                if (speed === 'NaN') {
                    speed = '';
                }
                results = {
                    bp_name: this.node.bp_name,
                    name: this.node.name,
                    host: this.node.host + ":" + this.node.port,
                    status: raw.status,
                    error_code: raw.error_code,
                    error_detail: raw.error_detail,
                    blocks_received: raw.block_count,
                    total_test_time: total_time,
                    speed: speed
                };
                return [2 /*return*/, results];
            });
        });
    };
    BlockTransmissionTestRunner.prototype.wait_for_tests = function (num) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!true) return [3 /*break*/, 2];
                                    // console.log(`Checking success for ${this.node.name}`);
                                    process.stdout.write(".");
                                    if (this.block_count >= num) {
                                        clearTimeout(this.kill_timer);
                                        resolve(this.get_result_json());
                                        return [3 /*break*/, 2];
                                    }
                                    if (this.killed) {
                                        clearTimeout(this.kill_timer);
                                        resolve(this.get_result_json());
                                        return [3 /*break*/, 2];
                                    }
                                    return [4 /*yield*/, utils_1.sleep(1000)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    BlockTransmissionTestRunner.prototype.kill = function () {
        this.killed = true;
        this.killed_reason = 'timeout';
        this.killed_detail = 'Timed out while receiving blocks';
    };
    return BlockTransmissionTestRunner;
}(TestRunner));
var write_results = function (results, headers, network) { return __awaiter(void 0, void 0, void 0, function () {
    var filename, write_header;
    return __generator(this, function (_a) {
        filename = network + ".csv";
        write_header = false;
        if (!fs.existsSync(filename)) {
            write_header = true;
        }
        fs.open(filename, 'a+', function (err, fp) { return __awaiter(void 0, void 0, void 0, function () {
            var do_write;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        do_write = function (fp, data) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, reject) {
                                        fs.write(fp, data, function (err, bytes_written, buffer) {
                                            if (err) {
                                                reject(err);
                                            }
                                            else {
                                                resolve([bytes_written, buffer]);
                                            }
                                        });
                                    })];
                            });
                        }); };
                        if (!write_header) return [3 /*break*/, 2];
                        return [4 /*yield*/, do_write(fp, headers.join(',') + '\n')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, do_write(fp, results.join(',') + '\n')];
                    case 3:
                        _a.sent();
                        console.log("Wrote results to " + filename);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
var run_tests = function (nodes, network) { return __awaiter(void 0, void 0, void 0, function () {
    var all_results, n, node, runner, results, speed, res_array, headers, d;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                all_results = new Map();
                n = 0;
                _a.label = 1;
            case 1:
                if (!(n < nodes[network].length)) return [3 /*break*/, 5];
                node = nodes[network][n];
                console.log("Running tests for " + node.name + " (" + node.host + ":" + node.port + ")");
                runner = new BlockTransmissionTestRunner(node);
                return [4 /*yield*/, runner.run(debug)];
            case 2:
                _a.sent();
                return [4 /*yield*/, runner.get_result_json()];
            case 3:
                results = _a.sent();
                speed = parseFloat(results.speed);
                if (isNaN(speed) || results.blocks_received < 5000) {
                    speed = 0;
                }
                all_results.set(results.bp_name, speed);
                _a.label = 4;
            case 4:
                n++;
                return [3 /*break*/, 1];
            case 5:
                res_array = [];
                headers = [
                    'evilproducer',
                    'eosdacserval',
                    'lioninjungle',
                    'ohtigertiger',
                    'alohaeostest',
                    'eosnationftw',
                    'ivote4eosusa',
                    'teamgreymass',
                    'greeneosiobp',
                    'eosphereiobp',
                    'junglesweden',
                    'eosbarcelona',
                    'atticlabjbpn'
                ];
                d = new Date();
                res_array.push(d.getFullYear() + "-" + (d.getUTCMonth() - 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes());
                headers.forEach(function (prod_name) {
                    res_array.push(all_results.get(prod_name));
                });
                headers.unshift('Date');
                return [4 /*yield*/, write_results(res_array, headers, network)];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var network = process.env.NETWORK || 'jungle';
var debug = !!process.env.NETWORK;
var test_interval_ms = 60 * 60 * 3 * 1000;
run_tests(node_config_1["default"], network);
setInterval(function () { return run_tests(node_config_1["default"], network); }, test_interval_ms);
