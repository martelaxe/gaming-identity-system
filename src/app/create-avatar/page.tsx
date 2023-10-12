
"use client"
import { useState } from 'react';
import personalSign from '../utils/signing';


const CreateAvatar = () => {
    const [signature, setSignature] = useState<string | null>(null);

    const handleSignMessage = async () => {
        const message = '{"action":"create","created_at":"1656843378","identity":"your_twitter_handle","platform":"twitter","prev":"KNyNFtvhlRVJh/oU6RryK2n+C2dja9aLQPjlv5VHMsQErZROojEmMAgmeEQVC094EOuHIYcv3lCYXf8d3zqDCQE=","uuid":"353449e6-3a6f-4ac8-ae65-ba14bf466baf"}';
        

        const signingKey =''; //TODO: Create signinig  key with metamask 
        
        const signature = await personalSign(message, signingKey);
        if (signature) {
            setSignature(signature);
            console.log(`Signature: ${signature}`);
        }
    };

    return (
        <div>
            <button onClick={handleSignMessage}>Sign Message with MetaMask</button>
            {signature && <p>Signature: {signature}</p>}
        </div>
    );
};

export default CreateAvatar;
