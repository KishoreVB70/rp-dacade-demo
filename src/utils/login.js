import { AuthClient } from '@dfinity/auth-client';

export default async function loginWithloginWithIdentity(){
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
    
    if(!isAuthenticated) {
        await new Promise((resolve) => {
            authClient.login({
                identityProvider: "https://identity.ic0.app/",
                onSuccess: resolve,
            });
        });
    }
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    return principal;
}