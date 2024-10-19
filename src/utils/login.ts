import { AuthClient } from '@dfinity/auth-client';
import { updateState } from './store';

export default async function loginWithloginWithIdentity(): Promise<String>{
    const authClient: AuthClient = await AuthClient.create();
    const isAuthenticated: boolean = await authClient.isAuthenticated();
    
    if(!isAuthenticated) {
        await new Promise<void>((resolve) => {
            authClient.login({
                // For NFID -> https://nfid.one/authenticate
                identityProvider: "https://identity.ic0.app/",
                onSuccess: resolve,
            });
        });
    }
    
    const identity = authClient.getIdentity();
    const principal: string = identity.getPrincipal().toString();
    updateState({userPrincipal: principal});
    return principal;
}