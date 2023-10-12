import { ethers } from 'ethers';

async function personalSign(message: string, privateKey: string | ethers.SigningKey) {
    const wallet = new ethers.Wallet(privateKey);
    const messageHash = ethers.hashMessage(message);
    const signature = await wallet.signMessage(ethers.toBeArray(messageHash));
    return signature;
}

export default personalSign;
