import {Actor, HttpAgent, Identity} from "@dfinity/agent";
import {idlFactory as issuerIDL} from "@/lib/issuer";
import { issuer_canister_id } from "../constants";


export const getCredential = async(identity: Identity | null) => {
    try {
        if(identity == null) {
          return;
        }
    
        const agent = await HttpAgent.create({ host: 'https://ic0.app', identity });
        console.log(agent);
    
        const actor = Actor.createActor(issuerIDL, {
          agent,
          canisterId: issuer_canister_id,
        });
    
        const result = await actor.add_course_completion("DEMO");    
        console.log(result);
    } catch(error) {
        console.log(error);
    }
}

