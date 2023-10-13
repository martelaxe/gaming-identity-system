
"use client"
import { useState } from 'react';
import personalSign from '../utils/signing';


const CreateAvatar = () => {
  const [payload, setPayload] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const [coinbase, setCoinbase] = useState<string | null>(null);
  const [pubkey, setPubKey] = useState<string | null>(null);
  const [postid,setPostId] = useState<string | null>(null);

  const [proofRes, setProofRes] = useState<string | null>(null);

  const [twitter_hanlder, setTwitter] = useState<string | null>(null);



  const API_URL = 'https://proof-service.nextnext.id'

  const handleSignMessage = async () => {

    const timestamp = Math.floor(Date.now() / 1000);
    const message = 'Create Game ID'

    const obj = await personalSign(message);
    if (obj) {
      setCoinbase(obj.coinbase);
      setPubKey(obj.publicKey);
      const payload = await getPayload(obj.publicKey);
      // Remove the '0x' prefix
      let signedPayload = await personalSign(payload.sign_payload);
      const hexSignature = signedPayload.signature.slice(2);

      // Convert hex to base64
      const base64Signature = Buffer.from(hexSignature, 'hex').toString('base64');
      console.log(`Signature: ${base64Signature}`);
      setContent(payload.post_content.default.replace("%SIG_BASE64%",base64Signature));
      setPayload(payload);
    }
  };

  const verifyPost = async () => {
    const body = {
      action: "create",
      platform: "twitter",
      identity: twitter_hanlder,
      public_key: pubkey!.slice(2),
      proof_location: postid,
      extra: {},
      uuid: payload.uuid,
      created_at: payload.created_at
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
    const newProofRes = await response.json()
    // {"message":"invalid secp256k1 public key: invalid secp256k1 public key: invalid secp256k1 public key: invalid secp256k1 public key"}
    setProofRes(newProofRes);
  };

  const getPayload = async (pubkey) => {
    const body = {
      action: "create",
      platform: "twitter",
      identity: twitter_hanlder,
      public_key: pubkey!.slice(2)
    };
    const response = await fetch(`${API_URL}/v1/proof/payload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    const payloadRes = await response.json();
    console.log(payloadRes);
    return payloadRes;
  };
  return (
    <div>
      <label>Twitter Account</label>
      <input type="text" onChange={(e) => { setTwitter(e.target.value) }} />
      <button onClick={handleSignMessage}>Sign Message with MetaMask</button>
      {
        content &&
        <>
          <h3>Make post on twitter:</h3>
          <div>{content}</div>
          <br /><br />
          <label>Post ID</label>
          <input type="text" onChange={(e) => { setPostId(e.target.value) }} />
          <button onClick={verifyPost}>Verify Post</button>
          {JSON.stringify(proofRes)}
        </>
      }

    </div>
  );
};

export default CreateAvatar;
