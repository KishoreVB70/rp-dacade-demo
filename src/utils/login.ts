import { AuthClient } from '@dfinity/auth-client';
import { updateState } from './store';
import { idlFactory, canisterId} from '../rpdemo_backend';
import { HttpAgent, Actor, Identity} from '@dfinity/agent';
import { ii_url } from './constants';

async function authenticateUser(): Promise<Identity> {
    const authClient: AuthClient = await AuthClient.create();
    const isAuthenticated: boolean = await authClient.isAuthenticated();
    if(!isAuthenticated) {
        await new Promise<void>((resolve) => {
            authClient.login({
                // For NFID -> https://nfid.one/authenticate
                identityProvider: ii_url,
                onSuccess: resolve,
            });
        });
    }
    return authClient.getIdentity();
}

export async function getRpBackendActor(): Promise<Actor> {
    const identity = authenticateUser();
    const rpBackendActor = Actor.createActor(idlFactory, {
        agent: new HttpAgent({
            identity,
        }),
        canisterId,
    });
    console.log(rpBackendActor);
    return rpBackendActor;
};

export default async function loginWithloginWithIdentity(): Promise<String>{
    const identity = await authenticateUser();
    const principal: string = identity.getPrincipal().toString();
    updateState({userPrincipal: principal});
    return principal;
}