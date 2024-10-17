import { requestVerifiablePresentation } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
import { Principal } from "@dfinity/principal";
import { jwtDecode } from "jwt-decode";
import { updateState } from "./store";


// Deployed issuer url with id as query param- https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=bu5ax-5iaaa-aaaam-qbgcq-cai
export default function requestVC(userPrincipal, name, recepientName) {
  return new Promise((resolve, reject) => {
    requestVerifiablePresentation({
      onSuccess: async (token) => {
        try {
          let decodedToken = jwtDecode(String(token.Ok));
          let decodedIIToken = jwtDecode(decodedToken.vp?.verifiableCredential[0]);
          let decodedIssuerToken = jwtDecode(decodedToken.vp?.verifiableCredential[1]);
          let verificationState = decodedIssuerToken.vc?.type[1];
          updateState({ 
            decodedToken: decodedToken,
            decodedIIToken: decodedIIToken,
            decodedIssuerToken: decodedIssuerToken,
            verificationState:verificationState
          });
          resolve(decodedToken);  // Resolve the promise with the decoded token
        } catch (error) {
          reject(error);  // Handle any error during token decoding or state update
        }
      },
      onError(e) {
        console.log("Error: ", e);
        reject(e);  // Reject the promise if an error occurs
      },
      issuerData: {
        origin: "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/",
        canisterId: Principal.fromText("bu5ax-5iaaa-aaaam-qbgcq-cai"),
      },
      credentialData: {
        credentialSpec: {
          credentialType: `Verified ${name} completion on Dacade`,
          arguments: {
            name: recepientName,
          },
        },
        credentialSubject: Principal.fromText(userPrincipal),
      },
      identityProvider: new URL("https://identity.ic0.app"),
    });
  });
}