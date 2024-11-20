import { useState, useCallback, useLayoutEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { ii_frontend_url_experimental } from "@/lib/constants";
import { ICPAuthReturn } from "@/lib/types";
import { useAuth } from "@/lib/context/AuthContext";
import { popupCenter } from "@/lib/utils";

function useICPAuth(): ICPAuthReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const { setPrincipal } = useAuth();

  // Initialize the AuthClient and check if the user is authenticated
  useLayoutEffect(() => {
    async function initializeAuthClient() {
      const client: AuthClient = await AuthClient.create();
      setAuthClient(client);

      // Check if the user is already authenticated - local storage session
      const authStatus = await client.isAuthenticated();
      if (authStatus) {
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
      }
      setIsLoading(false);
    }
    initializeAuthClient();
  }, []);

  const loginWithInternetIdentity = useCallback(async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: ii_frontend_url_experimental,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
        },
        windowOpenerFeatures: popupCenter(),
      });
    }
  }, [authClient]);

  const logout = useCallback(async () => {
    if (authClient) {
      await authClient.logout();
      setPrincipal(null);
      /* 
      Creating a new instance of authClient to 
      prevent unexpected behaviour during subsequent login
      */
      await AuthClient.create();
    }
  }, [authClient]);

  return { loginWithInternetIdentity, logout, isLoading };
}

export default useICPAuth;