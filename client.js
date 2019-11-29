
const {Serialize} = require('eosjs');
const net = require('net');
const fetch = require('node-fetch');

const {abi, types} = require('./net-protocol');


// const HOST = '127.0.0.1';
// const PORT = 9877;
// const API = 'http://127.0.0.1:8888';
const HOST = 'jungle2.eosdac.io';
const PORT = 9862;
const API = 'https://jungle.eosdac.io';
// const HOST = 'eu.eosdac.io';
// const PORT = 49876;
// const API = 'https://eu.eosdac.io';


function client_data(data){
    console.log(`Got data`, data);
    debug_message(data);
}

async function connect(){
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(PORT, HOST, function() {
            console.log('Connected to p2p');

            client.on('data', client_data);

            resolve(client);
        });
    });

}


function debug_message(array){
    const sb = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder,
        textDecoder: new TextDecoder,
        array
    });

    const len = sb.getUint32();
    const type = sb.get();
    const msg_types = abi.variants[0].types;
    const type_name = msg_types[type];


    console.log(`LENGTH: ${len}, TYPE : ${type_name} (${type})`);
    if (typeof type_name !== 'undefined'){
        try {
            console.log(types.get(type_name).deserialize(sb));
        }
        catch (e){
            console.error(`Failed to deserialize`, e);
        }
    }

}

async function send_handshake(client){
    /*
       struct handshake_message {
      uint16_t                   network_version = 0; ///< incremental value above a computed base
      chain_id_type              chain_id; ///< used to identify chain
      fc::sha256                 node_id; ///< used to identify peers and prevent self-connect
      chain::public_key_type     key; ///< authentication key; may be a producer or peer key, or empty
      tstamp                     time;
      fc::sha256                 token; ///< digest of time to prove we own the private key of the key above
      chain::signature_type      sig; ///< signature for the digest
      string                     p2p_address;
      uint32_t                   last_irreversible_block_num = 0;
      block_id_type              last_irreversible_block_id;
      uint32_t                   head_num = 0;
      block_id_type              head_id;
      string                     os;
      string                     agent;
      int16_t                    generation;
   };*/

    const res = await fetch(`${API}/v1/chain/get_info`);
    const info = await res.json();
    console.log(info);

    /*
    send lib and head block which are in the past, cannot deserialize the message
     */
    const msg = {
      "network_version": 1207,
      "chain_id": info.chain_id,
      "node_id": 'A6F45B421C2A64662E86456C258750290844CA41893F00A4DEF557BDAF20FFBD',
      "key": 'PUB_K1_11111111111111111111111111111111149Mr2R',
      "time": '1574986199433946000',
      "token": '0000000000000000000000000000000000000000000000000000000000000000',
      "sig": 'SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne',
      "p2p_address": '127.0.0.1:9876 - a6f45b4',
      "last_irreversible_block_num": info.last_irreversible_block_num,
      "last_irreversible_block_id": info.last_irreversible_block_id,
      "head_num": info.head_block_num,
      "head_id": info.head_block_id,
      "os": 'linux',
      "agent": '"Dream Ghost"',
      "generation": 1
    };


    const sb = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder,
        textDecoder: new TextDecoder
    });

    // put the message into a serialbuffer
    types.get('handshake_message').serialize(sb, msg);

    const len = sb.length;
    console.log(`Handshake buffer is ${len} long`);

    // Append length and msg type
    const lenbuf = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder,
        textDecoder: new TextDecoder
    });
    lenbuf.pushUint32(len + 1);
    lenbuf.push(0);

    const buf = Buffer.concat([Buffer.from(lenbuf.asUint8Array()), Buffer.from(sb.asUint8Array())]);

    console.log(`Sending handshake`, buf);
    client.write(buf);

}


connect().then((client) => {
    // if you do not send the handshake then the server will respond with time_message anyway
    send_handshake(client);
});