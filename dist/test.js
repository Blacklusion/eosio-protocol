"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deserializer_1 = require("./protocol/stream/deserializer");
const tokenizer_1 = require("./protocol/stream/tokenizer");
const debugger_1 = require("./protocol/stream/debugger");
const connection_1 = require("./protocol/connection");
const messages_1 = require("./protocol/messages");
const fs = require("fs");
const utils_1 = require("./includes/utils");
const pron = require("./includes/pron");
const node_config_1 = require("./node-config");
const fetch = require('node-fetch');
class TestRunner {
    constructor(node) {
        this.node = node;
        this.last_block_time = BigInt(0);
        this.block_count = 0;
        this.killed = false;
        this.killed_reason = '';
        this.killed_detail = '';
        this.latencies = [];
        this.block_timeout = 10000;
        const p2p = new connection_1.EOSIOP2PClientConnection({ ...this.node, ...{ debug } });
        this.p2p = p2p;
    }
    run(debug = false) {
        console.log(`Test runner doesnt override run`);
    }
    async send_handshake(override) {
        let msg = new messages_1.HandshakeMessage();
        msg.copy({
            "network_version": 1206,
            "chain_id": '0000000000000000000000000000000000000000000000000000000000000000',
            "node_id": '0585cab37823404b8c82d6fcc66c4faf20b0f81b2483b2b0f186dd47a1230fdc',
            "key": 'PUB_K1_11111111111111111111111111111111149Mr2R',
            "time": '1574986199433946000',
            "token": '0000000000000000000000000000000000000000000000000000000000000000',
            "sig": 'SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne',
            "p2p_address": `eosdac-p2p-client:9876 - a6f45b4`,
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
        await this.p2p.send_message(msg);
    }
}
class BlockTransmissionTestRunner extends TestRunner {
    constructor(node) {
        super(node);
    }
    async on_signed_block(msg) {
        // console.log('TestRunner:on_signed_block');
        clearTimeout(this.kill_timer);
        this.kill_timer = setTimeout(this.kill.bind(this), this.block_timeout);
        this.block_count++;
        const block_num_hex = msg.previous.substr(0, 8); // first 64 bits
        const block_num = parseInt(block_num_hex, 16) + 1;
        const tm = process.hrtime.bigint();
        if (this.last_block_time > 0) {
            const latency = Number(tm - this.last_block_time);
            this.latencies.push(latency);
            // console.log(`Received block : ${block_num} signed by ${msg.producer} with latency ${latency} - ${this.block_count} received from ${this.node.host}`);
        }
        this.last_block_time = tm;
    }
    async on_error(e) {
        // console.error(`Received error`, e);
        this.killed = true;
        this.killed_reason = e.code;
        this.killed_detail = (e + '').replace('Error: ', '');
    }
    log_results(results) {
        console.log(results);
    }
    async run(debug = false) {
        this.kill_timer = setTimeout(this.kill.bind(this), this.block_timeout);
        const num_blocks = 5000;
        const p2p = this.p2p;
        p2p.on('net_error', (e) => {
            this.killed = true;
            this.killed_reason = 'net_error';
            this.killed_detail = e.message;
        });
        try {
            const client = await p2p.connect();
            // client.pipe(process.stdout);
            const deserialized_stream = client
                .pipe(new tokenizer_1.EOSIOStreamTokenizer({}))
                .pipe(new deserializer_1.EOSIOStreamDeserializer({}))
                .on('data', (obj) => {
                if (obj[0] === 7) {
                    // console.log(`Received block `);
                    this.on_signed_block(obj[2]);
                }
                if (obj[0] === 2) {
                    // console.log(`Received block `);
                    // this.on_signed_block(obj[2]);
                    this.killed = true;
                    this.killed_reason = 'go_away';
                    this.killed_detail = `Received go away message ${messages_1.GoAwayMessage.reasons[obj[2].reason]}`;
                }
            });
            if (debug) {
                deserialized_stream
                    .pipe(new debugger_1.EOSIOStreamConsoleDebugger({ prefix: '<<<' }));
            }
            const res = await fetch(`${this.node.api}/v1/chain/get_info`);
            let info = await res.json();
            const prev_info = await this.get_prev_info(info, num_blocks);
            // const prev_info = info;
            const override = {
                chain_id: info.chain_id,
                p2p_address: `dreamghost::${pron[0]} - a6f45b4`,
                last_irreversible_block_num: prev_info.last_irreversible_block_num,
                last_irreversible_block_id: prev_info.last_irreversible_block_id,
                head_num: prev_info.head_block_num,
                head_id: prev_info.head_block_id,
            };
            await this.send_handshake(override);
            // get num blocks before lib
            const msg = new messages_1.SyncRequestMessage();
            msg.start_block = prev_info.last_irreversible_block_num;
            msg.end_block = prev_info.last_irreversible_block_num + num_blocks;
            await p2p.send_message(msg);
        }
        catch (e) { }
        const results = await this.wait_for_tests(num_blocks);
        p2p.disconnect();
        // this.log_results(results);
    }
    async get_block_id(block_num_or_id) {
        const res = await fetch(`${this.node.api}/v1/chain/get_block`, {
            method: 'POST',
            body: JSON.stringify({ block_num_or_id })
        });
        const info = await res.json();
        return info.id;
    }
    async get_prev_info(info, num = 1000) {
        if (num > 0) {
            info.head_block_num -= num;
            info.last_irreversible_block_num -= num;
            info.head_block_id = await this.get_block_id(info.head_block_num);
            info.last_irreversible_block_id = await this.get_block_id(info.last_irreversible_block_num);
        }
        return info;
    }
    async get_result_json() {
        const raw = {
            status: 'success',
            block_count: this.block_count,
            latencies: this.latencies,
            error_code: this.killed_reason,
            error_detail: this.killed_detail
        };
        raw.status = (!this.killed_reason) ? 'success' : 'error';
        let avg = 0;
        let sum = 0;
        let sum_b = BigInt(0);
        if (raw.latencies.length > 0) {
            sum = raw.latencies.reduce((previous, current) => current += previous);
            sum_b = BigInt(sum_b);
            avg = sum / raw.latencies.length;
        }
        const ns_divisor = Math.pow(10, 9);
        const total_time = sum / ns_divisor;
        const blocks_per_ns = raw.block_count / sum;
        let speed = (blocks_per_ns * ns_divisor).toFixed(10);
        if (speed === 'NaN') {
            speed = '';
        }
        const results = {
            bp_name: this.node.bp_name,
            name: this.node.name,
            host: `${this.node.host}:${this.node.port}`,
            status: raw.status,
            error_code: raw.error_code,
            error_detail: raw.error_detail,
            blocks_received: raw.block_count,
            total_test_time: total_time,
            speed: speed
        };
        return results;
    }
    async wait_for_tests(num) {
        return new Promise(async (resolve, reject) => {
            while (true) {
                // console.log(`Checking success for ${this.node.name}`);
                process.stdout.write(`.`);
                if (this.block_count >= num) {
                    clearTimeout(this.kill_timer);
                    resolve(this.get_result_json());
                    break;
                }
                if (this.killed) {
                    clearTimeout(this.kill_timer);
                    resolve(this.get_result_json());
                    break;
                }
                await utils_1.sleep(1000);
            }
        });
    }
    kill() {
        this.killed = true;
        this.killed_reason = 'timeout';
        this.killed_detail = 'Timed out while receiving blocks';
    }
}
const write_results = async (results, headers, network) => {
    const filename = `${network}.csv`;
    let write_header = false;
    if (!fs.existsSync(filename)) {
        write_header = true;
    }
    fs.open(filename, 'a+', async (err, fp) => {
        const do_write = async (fp, data) => {
            return new Promise((resolve, reject) => {
                fs.write(fp, data, (err, bytes_written, buffer) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve([bytes_written, buffer]);
                    }
                });
            });
        };
        if (write_header) {
            await do_write(fp, headers.join(',') + '\n');
        }
        await do_write(fp, results.join(',') + '\n');
        console.log(`Wrote results to ${filename}`);
    });
};
const run_tests = async (nodes, network) => {
    const all_results = new Map();
    for (let n = 0; n < nodes[network].length; n++) {
        const node = nodes[network][n];
        console.log(`Running tests for ${node.name} (${node.host}:${node.port})`);
        const runner = new BlockTransmissionTestRunner(node);
        await runner.run(debug);
        const results = await runner.get_result_json();
        let speed = parseFloat(results.speed);
        if (isNaN(speed) || results.blocks_received < 5000) {
            speed = 0;
        }
        all_results.set(results.bp_name, speed);
    }
    const res_array = [];
    const headers = [
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
    const d = new Date();
    res_array.push(`${d.getFullYear()}-${d.getUTCMonth() - 1}-${d.getUTCDate()}T${d.getUTCHours()}:${d.getUTCMinutes()}`);
    headers.forEach((prod_name) => {
        res_array.push(all_results.get(prod_name));
    });
    headers.unshift('Date');
    await write_results(res_array, headers, network);
};
const network = process.env.NETWORK || 'jungle';
const debug = !!process.env.NETWORK;
const test_interval_ms = 60 * 60 * 3 * 1000;
run_tests(node_config_1.default, network);
setInterval(() => run_tests(node_config_1.default, network), test_interval_ms);
//# sourceMappingURL=test.js.map