const secp  = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const PRIVATE_KEY = secp.secp256k1.utils.randomPrivateKey();
const PUBLIC_KEY = secp.secp256k1.getPublicKey(PRIVATE_KEY);
const ADDRESS = keccak256(PUBLIC_KEY.slice(1)).slice(-20);

console.log(`Private Key: ${toHex(PRIVATE_KEY)}`);
console.log('Public Key:', toHex(PUBLIC_KEY));
console.log('Address:', toHex(ADDRESS));