import { requestVerifiablePresentation } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
import { Principal } from "@dfinity/principal";
import { jwtDecode } from "jwt-decode";
import { updateState } from "./store";
import {validateCredential} from "./validateCredential";



// Deployed issuer url with id as query param- https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=bu5ax-5iaaa-aaaam-qbgcq-cai
export default function requestVC(userPrincipal, name, recepientName) {
  let vc_spec =   
  {
    credentialType: `Verified ${name} completion on Dacade`,
    arguments: {
      name: recepientName,
    },
  }

  return new Promise((resolve, reject) => {
    requestVerifiablePresentation({
      onSuccess: async (res) => {
        try {
          let verificationState;
          let decodedToken = jwtDecode(String(res.Ok));

          // 1) Check if the token is a verifiable credential
          if(!decodedToken.hasOwnProperty('vp')) {
            verificationState = "No Verified presentation in response";
            updateState({ 
              decodedToken: decodedToken,
              verificationState:verificationState
            });
            resolve(decodedToken);
            return;
          }

          let decodedIIToken = jwtDecode(decodedToken.vp?.verifiableCredential[0]);
          let decodedIssuerToken = jwtDecode(decodedToken.vp?.verifiableCredential[1]);

          // Semantic validation of the credential
          validateCredential(vc_spec, decodedIssuerToken.vc);

          // If the validadteCredential function doesn't throw, VC is validated
          verificationState = vc_spec.credentialType;

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
        credentialSpec: vc_spec,
        credentialSubject: Principal.fromText(userPrincipal),
      },
      identityProvider: new URL("https://identity.ic0.app"),
    });
  });
}