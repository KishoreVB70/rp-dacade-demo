import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as canisterIdl } from "./idlFactory.did.js";
import { issuerIdl} from "./issueridl.did.js";
import { Principal } from "@dfinity/principal";

const canisterId = "";
const identity = await authClient.getIdentity();

// Agent can also be set as the boundary node
const agent = new HttpAgent({ identity });

const canisterActor = Actor.createActor(issuerIdl, {
  agent,
  canisterId,
});


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