import { AuthClient } from '@dfinity/auth-client';
import { updateState } from './store';
import { Identity } from '@dfinity/agent';
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

export default async function loginWithloginWithIdentity(): Promise<String>{
    const identity = await authenticateUser();
    const principal: string = identity.getPrincipal().toString();
    updateState({userPrincipal: principal});
    return principal;
}