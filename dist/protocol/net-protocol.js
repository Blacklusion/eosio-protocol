"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetProtocol = void 0;
const { Serialize } = require('eosjs');
const system_abi_1 = require("./system-abi");
/*
ABI for net messages, this plugs directly into eosjs
 */
var NetProtocol;
(function (NetProtocol) {
    NetProtocol.variant_types = () => {
        return NetProtocol.abi.variants[0].types;
    };
    NetProtocol.abi = {
        version: 'eosio::abi/1.1',
        types: [],
        structs: [{
                "name": "transaction_id",
                "base": "checksum256",
                "fields": []
            }, {
                "name": "ordered_checksum",
                "base": "",
                "fields": [
                    {
                        "name": "mode",
                        "type": "uint32"
                    },
                    {
                        "name": "pending",
                        "type": "uint32"
                    },
                    {
                        "name": "ids",
                        "type": "checksum256[]"
                    }
                ]
            }, {
                "name": "handshake_message",
                "base": "",
                "fields": [
                    {
                        "name": "network_version",
                        "type": "uint16"
                    },
                    {
                        "name": "chain_id",
                        "type": "checksum256"
                    },
                    {
                        "name": "node_id",
                        "type": "checksum256"
                    },
                    {
                        "name": "key",
                        "type": "public_key"
                    },
                    {
                        "name": "time",
                        "type": "uint64"
                    },
                    {
                        "name": "token",
                        "type": "checksum256"
                    },
                    {
                        "name": "sig",
                        "type": "signature"
                    },
                    {
                        "name": "p2p_address",
                        "type": "string"
                    },
                    {
                        "name": "last_irreversible_block_num",
                        "type": "uint32"
                    },
                    {
                        "name": "last_irreversible_block_id",
                        "type": "checksum256"
                    },
                    {
                        "name": "head_num",
                        "type": "uint32"
                    },
                    {
                        "name": "head_id",
                        "type": "checksum256"
                    },
                    {
                        "name": "os",
                        "type": "string"
                    },
                    {
                        "name": "agent",
                        "type": "string"
                    },
                    {
                        "name": "generation",
                        "type": "uint16"
                    }
                ]
            },
            {
                "name": "chain_size_message",
                "base": "",
                "fields": [
                    {
                        "name": "last_irreversible_block_num",
                        "type": "uint32"
                    },
                    {
                        "name": "last_irreversible_block_id",
                        "type": "checksum256"
                    },
                    {
                        "name": "head_num",
                        "type": "uint32"
                    },
                    {
                        "name": "head_id",
                        "type": "checksum256"
                    }
                ]
            },
            {
                "name": "go_away_message",
                "base": "",
                "fields": [
                    {
                        "name": "reason",
                        "type": "uint8"
                    },
                    {
                        "name": "node_id",
                        "type": "checksum256"
                    }
                ]
            },
            {
                "name": "time_message",
                "base": "",
                "fields": [
                    {
                        "name": "org",
                        "type": "uint64"
                    },
                    {
                        "name": "rec",
                        "type": "uint64"
                    },
                    {
                        "name": "xmt",
                        "type": "uint64"
                    },
                    {
                        "name": "dst",
                        "type": "uint64"
                    }
                ]
            },
            {
                "name": "notice_message",
                "base": "",
                "fields": [
                    {
                        "name": "known_trx",
                        "type": "ordered_checksum"
                    },
                    {
                        "name": "known_blocks",
                        "type": "ordered_checksum"
                    }
                ]
            },
            {
                "name": "request_message",
                "base": "",
                "fields": [
                    {
                        "name": "req_trx",
                        "type": "ordered_checksum"
                    },
                    {
                        "name": "req_blocks",
                        "type": "ordered_checksum"
                    }
                ]
            },
            {
                "name": "sync_request_message",
                "base": "",
                "fields": [
                    {
                        "name": "start_block",
                        "type": "uint32"
                    },
                    {
                        "name": "end_block",
                        "type": "uint32"
                    }
                ]
            }],
        actions: [],
        tables: [],
        ricardian_clauses: [],
        error_messages: [],
        abi_extensions: [],
        variants: [{
                name: 'net_message',
                types: [
                    'handshake_message',
                    'chain_size_message',
                    'go_away_message',
                    'time_message',
                    'notice_message',
                    'request_message',
                    'sync_request_message',
                    'signed_block',
                    'packed_transaction'
                ]
            }]
    };
    const all_abi = NetProtocol.abi;
    all_abi.variants = NetProtocol.abi.variants.concat(system_abi_1.SystemABI.system_abi.variants);
    all_abi.structs = NetProtocol.abi.structs.concat(system_abi_1.SystemABI.system_abi.structs);
    NetProtocol.types = Serialize.getTypesFromAbi(Serialize.createInitialTypes(), all_abi);
})(NetProtocol = exports.NetProtocol || (exports.NetProtocol = {}));
//# sourceMappingURL=net-protocol.js.map