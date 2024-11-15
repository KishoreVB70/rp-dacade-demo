import { AuthClient } from '@dfinity/auth-client';
import { updateState } from './store';
import { Identity } from '@dfinity/agent';
import { ii_url } from './constants';
const popupCenter = (): string | undefined => {
    const AUTH_POPUP_WIDTH = 576;
    const AUTH_POPUP_HEIGHT = 625;
  
    if (typeof window === "undefined" || !window.top) {
      return undefined;
    }
  
    const { innerWidth, innerHeight, screenX, screenY } = window;
  
    const y = innerHeight / 2 + screenY - AUTH_POPUP_HEIGHT / 2;
    const x = innerWidth / 2 + screenX - AUTH_POPUP_WIDTH / 2;
  
    return `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=${AUTH_POPUP_WIDTH}, height=${AUTH_POPUP_HEIGHT}, top=${y}, left=${x}`;
  };

async function authenticateUser(): Promise<Identity> {
    const authClient: AuthClient = await AuthClient.create();
    const isAuthenticated: boolean = await authClient.isAuthenticated();
    if(!isAuthenticated) {
        await new Promise<void>((resolve) => {
            authClient.login({
                identityProvider: ii_url,
                onSuccess: resolve,
                windowOpenerFeatures: popupCenter()
            });
        });
    }
    return authClient.getIdentity();
}

export default async function loginWithloginWithIdentity(): Promise<String>{
    const identity = await authenticateUser();
    const principal: string = identity.getPrincipal().toString();
    updateState({identity, userPrincipal: principal});
    return principal;
}

export async function logout() {
    const authClient: AuthClient = await AuthClient.create();
    await authClient.logout()
}
