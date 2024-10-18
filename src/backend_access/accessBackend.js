import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as canisterIdl } from "./idlFactory.did.js";
import { issuerIdl} from "./issueridl.did.js";
import { Principal } from "@dfinity/principal";
import { AuthClient } from '@dfinity/auth-client';


const canisterId = "bu5ax-5iaaa-aaaam-qbgcq-cai";
const authClient = await AuthClient.create();
const identity = authClient.getIdentity();

// Agent can also be set as the boundary node
const agent = new HttpAgent({ identity });

const canisterActor = Actor.createActor(issuerIdl, {
  agent,
  canisterId,
});

export async function callDerivationOrigin(frontendHostname) {
  try {
    // Make the request to the canister
    const result = await canisterActor.derivation_origin({ frontend_hostname: frontendHostname });
    
    // Handle the result
    if ('Ok' in result) {
      console.log('Origin:', result.Ok.origin);  // Success case: Log the origin
    } else {
      if ('Internal' in result.Err) {
        console.error('Internal Error:', result.Err.Internal);  // Handle internal error
      } else if ('UnsupportedOrigin' in result.Err) {
        console.error('Unsupported Origin:', result.Err.UnsupportedOrigin);  // Handle unsupported origin error
      }
    }
  } catch (error) {
    console.error('Error calling canister:', error);  // Handle any other error
  }
}



// Example: Calling a method from the canister
async function callVerifyCredential(credential) {
    try {
      const result = await canisterActor.verifyCredential(credential);
      if(result) {
        console.log("Verification success");
      } else console.log("Verification failed");
    } catch (err) {
      console.error("Error calling canister: ", err);
    }
  }