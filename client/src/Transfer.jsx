import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [nonce, setNonce] = useState(1);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const data = {
      sender: address,
      nonce,
      amount: sendAmount,
      recipient,
    }

    const message = toHex(keccak256(utf8ToBytes(JSON.stringify(data))));

    const sig = secp256k1.sign(message, privateKey); 

    const sigCompact = sig.toCompactHex();
    const recoveryBit = sig.recovery;
    const sigHex = sigCompact + recoveryBit.toString(16).padStart(2, '0');

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sigHex,
        message,
        amount: parseInt(sendAmount),
        recipient,
      });
      console.log(balance);
      setBalance(balance);
      setNonce(nonce + 1);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <h3>Nonce: {nonce}</h3>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

// Private Key: d6cc0988cd0979b9e3b0b722d33118b54c40ea880a1a470cd6d5f8390daf0d06
// Public Key: 03b1031f193d19b2359d1bf268d4f7246ba625cd2da28a5810957194735d7ea143
// Address: 8e24e23bceb05fc656e6244b5c5f6bc31e894ba8

// Private Key: 3f2029640ae65b3bf6f16ee3964dce5b1016540f72e073eed722972ef7fd44af
// Public Key: 02a8efde306b98a6c22de4618d738bbdd72f318dcbaeecc07223f43e42ab85ed5c
// Address: 20b074e9c8c9481dc53c7d33c0d8a565688d8f3e

// Private Key: f64bc77e54cf3ce7114dd8e34bd023e4151ecefe06e82773c6a4fcc008ebff61
// Public Key: 020c03cde7468dcda335ea943971799be0cce078922901a9ed0387036b9ec1b653
// Address: 0f2858ae5a1a5c560188720a19150790d2c65c16  