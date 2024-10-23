import { requestVerifiablePresentation, VerifiablePresentationResponse } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
import { Principal } from "@dfinity/principal";
import { jwtDecode } from "jwt-decode";
import { updateState } from "./store";
import   validateCredential  from "./validateCredential";
import { CredentialRequestSpec } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
import { ii_url, issuer_canister_id, issuer_url } from "./constants";

// Main function for requesting verifiable credentials
export default function requestVC(userPrincipal: string, course: string): Promise<any> {

  const vc_spec: CredentialRequestSpec = {
    credentialType: `Verified ${course} completion on Dacade`,
    arguments: {
      course: course,
    },
  };

  return new Promise((resolve, reject) => {
    requestVerifiablePresentation({
      onSuccess: async (res: VerifiablePresentationResponse) => {
        try {

          let token: any;
          let decodedToken: any
          if("Ok" in res) {
            token = res.Ok;
            decodedToken = jwtDecode(token);
          } else {
            reject("Error in presentation response");
          }

          let verificationState: string;

          // Check if token contains a verifiable presentation
          if (!decodedToken.hasOwnProperty('vp')) {
            verificationState = "No Verified presentation in response";
            updateState({
              decodedToken,
              verificationState,
            });
            resolve(decodedToken);
            return;
          }

          const decodedIIToken: any = jwtDecode(decodedToken.vp?.verifiableCredential[0]);
          const decodedIssuerToken: any = jwtDecode(decodedToken.vp?.verifiableCredential[1]);

          // Validate the credential against the spec
          validateCredential(vc_spec, decodedIssuerToken.vc );

          // Update verification state
          verificationState = vc_spec.credentialType;

          updateState({
            decodedToken,
            decodedIIToken,
            decodedIssuerToken,
            verificationState,
            issuer: decodedIssuerToken.iss,
          });

          resolve(token); // Resolve with the decoded token after successful validation
        } catch (error) {
          reject(error); // Reject in case of any error
        }
      },
      onError: (e: any) => {
        console.log("Error: ", e);
        reject(e); // Reject the promise if there is an error
      },
      issuerData: {
        origin: issuer_url,
        canisterId: Principal.fromText(issuer_canister_id),
      },
      credentialData: {
        credentialSpec: vc_spec,
        credentialSubject: Principal.fromText(userPrincipal),
      },
      identityProvider: new URL(ii_url),
    });
  });
}
