
let state = {
    userPrincipal: "User not logged in!",
    token: "",
    decodedToken: {},
    decodedIIToken: {},
    decodedIssuerToken: {},
    verificationState: "User not verified",
};


export const getState = () => state;

// Function to update the state
export const updateState = (newState) => {
  state = { ...state, ...newState };
};