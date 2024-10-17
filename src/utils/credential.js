import { requestVerifiablePresentation } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
import { Principal } from "@dfinity/principal";


// Deployed issuer url with id as query param- https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=bu5ax-5iaaa-aaaam-qbgcq-cai
export default function requestVC(userPrincipal, name, recepientName){
  requestVerifiablePresentation({
    onSuccess: async () => {
      console.log("Success!");
    },
    onError(e) {
      console.log("Error: ", e);
    },
    issuerData: {
      origin: "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/",
      // Optional
      canisterId: Principal.fromText("bu5ax-5iaaa-aaaam-qbgcq-cai"),
    },
    credentialData: {
      credentialSpec: {
        credentialType: `Verified ${name} completion on Dacade`,
        //Optional
        arguments: {
          name: recepientName,
        },
      },
      credentialSubject: Principal.fromText(userPrincipal),
    },
    identityProvider: "https://identity.ic0.app",
  });
}