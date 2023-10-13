
"use client"
import { useState } from 'react';
import personalSign from '../utils/signing';


const CreateAvatar = () => {
    const [signature, setSignature] = useState<string | null>(null);
    const [coinbase, setCoinbase] = useState<string | null>(null);
    const [pubkey, setPubKey] = useState<string | null>(null);

    const [proofRes, setProofRes] = useState<string | null>(null);

    const [twitter_hanlder, setTwitter] = useState<string | null>(null);



    const API_URL = 'https://proof-service.nextnext.id'

    const handleSignMessage = async () => {
        const message = `{"action":"create","created_at":"1656843378","identity":"${twitter_hanlder}","platform":"twitter","prev":"KNyNFtvhlRVJh/oU6RryK2n+C2dja9aLQPjlv5VHMsQErZROojEmMAgmeEQVC094EOuHIYcv3lCYXf8d3zqDCQE=","uuid":"353449e6-3a6f-4ac8-ae65-ba14bf466baf"}`;


        const signingKey =''; //TODO: Create signinig  key with metamask

        const obj = await personalSign(message, signingKey);
        if (obj) {
            // Remove the '0x' prefix
            const hexSignature = obj.signature.slice(2);

            // Convert hex to base64
            const base64Signature = Buffer.from(hexSignature, 'hex').toString('base64');
            console.log(`Signature: ${base64Signature}`);
            setSignature(base64Signature);
            setCoinbase(obj.coinbase);
            setPubKey(obj.publicKey);
        }
    };

    const verifyPost = async() => {
      const body = {
        action: "create",
        platform: "twitter",
        identity: twitter_hanlder,
        public_key: pubkey.slice(2)
      };
      console.log(body)
      const response = await fetch(`${API_URL}/v1/proof`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      console.log(response);
      // {"message":"invalid secp256k1 public key: invalid secp256k1 public key: invalid secp256k1 public key: invalid secp256k1 public key"}
      setProofRes(await response.text());
    };
    return (
        <div>
            <label>Twitter Account</label>
            <input type="text" onChange={(e) => {setTwitter(e.target.value)}} />
            <button onClick={handleSignMessage}>Sign Message with MetaMask</button>
            {
              signature &&
              <>
              <h3>Make post on twitter:</h3>
              <p>🎭 Verifying my Twitter ID @your_twitter_handle for @NextDotID.</p>
              <p>Sig: {signature}</p>
              <br/>
              <p>Next.ID YOUR DIGITAL IDENTITIES IN ONE PLACE</p>
              <br/><br/>
              <button onClick={verifyPost}>Verify Post</button>
              {proofRes}
              </>
            }

        </div>
    );
};

export default CreateAvatar;
