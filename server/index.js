const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 }  = require('ethereum-cryptography/secp256k1.js');
const { toHex, hexToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  "0f2858ae5a1a5c560188720a19150790d2c65c16": 100,
  "20b074e9c8c9481dc53c7d33c0d8a565688d8f3e": 50,
  "8e24e23bceb05fc656e6244b5c5f6bc31e894ba8": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {sigHex, message, recipient, amount } = req.body;

  const recoveryBitFromHex = parseInt(sigHex.slice(-2), 16);
  const sigCompactFromHex = sigHex.slice(0, -2);
  let reconstructedSig = secp256k1.Signature.fromCompact(hexToBytes(sigCompactFromHex));
  reconstructedSig = reconstructedSig.addRecoveryBit(recoveryBitFromHex);
  
  const sender = toHex(keccak256(reconstructedSig.recoverPublicKey(message).toRawBytes().slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
