import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";


const providerOptions = {

  // Currently the package isn't inside the web3modal library currently. For now,
  // users must use this libary to create a custom web3modal provider.

  // All custom `web3modal` providers must be registered using the "custom-"
  // prefix.
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc:{
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

async function personalSign(message: string, privateKey: string | ethers.SigningKey) {
    //const wallet = new ethers.Wallet(privateKey);
    const conn = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(conn,"any");
    const signer = await provider.getSigner();
    const coinbase = await signer.getAddress();
    const messageHash = ethers.hashMessage(message);
    const signature = await signer.signMessage(ethers.toBeArray(messageHash));
    return({
      signature: signature,
      coinbase: coinbase
    });
}

export default personalSign;
