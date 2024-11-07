import { Identity } from "@dfinity/agent";

// Define the type for the state
export interface State {
  userPrincipal: string;
  token: string;
  decodedToken: Record<string, unknown>; // Assuming decodedToken is a generic object
  decodedIIToken: Record<string, unknown>; // Assuming decodedIIToken is a generic object
  decodedIssuerToken: Record<string, unknown>; // Assuming decodedIssuerToken is a generic object
  verificationState: string;
  issuer: string;
  identity: Identity | null;
}

// Initialize the state
let state: State = {
  userPrincipal: "",
  token: "",
  decodedToken: {},
  decodedIIToken: {},
  decodedIssuerToken: {},
  verificationState: "",
  issuer: "",
  identity: null,
};

// Function to get the current state
export const getState = (): State => state;

// Function to update the state
export const updateState = (newState: Partial<State>): void => {
  state = { ...state, ...newState };
};
