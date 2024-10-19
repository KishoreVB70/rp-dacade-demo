import { requestVerifiablePresentation, VerifiablePresentationResponse } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
import { Principal } from "@dfinity/principal";
import { jwtDecode } from "jwt-decode";
import { updateState } from "./store";
import   validateCredential  from "./validateCredential";

// Define types for the Verifiable Credential Spec
interface VcSpec {
  credentialType: string;
  arguments: {
    name: string;
  };
}

// Main function for requesting verifiable credentials
export default function requestVC(userPrincipal: string, name: string, recepientName: string): Promise<any> {

  const vc_spec: VcSpec = {
    credentialType: `Verified ${name} completion on Dacade`,
    arguments: {
      name: recepientName,
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
