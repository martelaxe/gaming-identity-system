import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as ethUtil from 'ethereumjs-util';
import * as secp256k1 from 'secp256k1';


const providerOptions = {

  // Currently the package isn't inside the web3modal library currently. For now,
  // users must use this libary to create a custom web3modal provider.

  // All custom `web3modal` providers must be registered using the "custom-"
  // prefix.
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        100: "https://rpc.gnosischain.com/",
        80001: "https://rpc-mumbai.maticvigil.com"
      }
    }
  }


};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions
});

async function personalSign(message: string) {
  const conn = await web3Modal.connect();
  const provider = new ethers.BrowserProvider(conn, "any");
  const signer = await provider.getSigner();
  const messageHash = ethers.hashMessage(message);
  const signature = await signer.signMessage(message);

  console.log('Message Hash:', messageHash);
  console.log('Signature:', signature);

  // Convert hex signature to Uint8Array
  const signatureMatch = signature.slice(2).match(/.{1,2}/g);
  if (!signatureMatch) {
    throw new Error('Invalid signature format');
  }
  const signatureBytes = new Uint8Array(signatureMatch.map(byte => parseInt(byte, 16)));

  // Ensure signatureBytes is 64 bytes long
  if (signatureBytes.length !== 65) {
    throw new Error('Invalid signature length');
  }

  // Convert message hash to Uint8Array
  const messageHashMatch = messageHash.slice(2).match(/.{1,2}/g);
  if (!messageHashMatch) {
    throw new Error('Invalid message hash format');
  }
  const messageHashBytes = new Uint8Array(messageHashMatch.map(byte => parseInt(byte, 16)));

  // Recover the public key
  const recoveredPublicKey = secp256k1.ecdsaRecover(
    signatureBytes.slice(0, 64), // Exclude the recovery id
    signatureBytes[64] - 27, // Recovery id
    messageHashBytes,
    true
  );

  const publicKeyHex = '04' + Buffer.from(recoveredPublicKey).toString('hex');

  console.log('Recovered Public Key:', publicKeyHex);

  return {
    signature: signature,
    coinbase: await signer.getAddress(),
    publicKey: publicKeyHex
  };
}


export default personalSign;