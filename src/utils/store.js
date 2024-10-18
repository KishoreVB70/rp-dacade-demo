
let state = {
    userPrincipal: "",
    token: "",
    decodedToken: {},
    decodedIIToken: {},
    decodedIssuerToken: {},
    verificationState: "",
    issuer: "",
};


export const getState = () => state;

// Function to update the state
export const updateState = (newState) => {
  state = { ...state, ...newState };
};