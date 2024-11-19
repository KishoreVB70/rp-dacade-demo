import { CredentialRequestSpec } from "@dfinity/verifiable-credentials/request-verifiable-presentation";

export interface Credential {
    id: string;
    name: string;
    description: string;
    issuer: string;
    link: string;
    derivationUrl: string;
    issuerUrl: string;
    credentialSpec: CredentialRequestSpec;
    canisterId: string;
  }
  
  export interface Opportunity {
    id: string;
    postedDate: number;
    title: string;
    description: string;
    company: string;
    requiredCredentials: Credential[];
    markdownContent: string;
    applyUrl: string;
  }

export type ICPAuthReturn = {
  loginWithInternetIdentity: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export type DecodedJWT = {
  iss: string;
  vp: {
    "@Context": string;
    type: string,
    // Exactly two strings: one for alias credential, one for requested credential
    verifiableCredential: [string, string];
  }
}

export type DecodedRequestedCredential = {
  exp: number;
  iss: string;
};

export type CredentialStatus = "present" | "not_present" | null;
