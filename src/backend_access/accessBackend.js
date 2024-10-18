import { Actor, HttpAgent } from '@dfinity/agent';
// import { idlFactory as canisterIdl } from "./";
import { Principal } from "@dfinity/principal";

const canisterId = "";
const identity = await authClient.getIdentity();
const actor = Actor.createActor(idlFactory, {
  agent: new HttpAgent({
    identity,
  }),
  canisterId,
});

// Example: Calling a method from the canister
async function callCanisterMethod() {
    try {
      const result = await canisterActor.greet("Hello, IC!");
      console.log("Canister response: ", result);
    } catch (err) {
      console.error("Error calling canister: ", err);
    }
  }