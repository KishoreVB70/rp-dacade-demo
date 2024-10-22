import { Principal } from "@dfinity/principal";
import { CredentialRequestSpec } from "@dfinity/verifiable-credentials/request-verifiable-presentation";
interface ValidateVpRequest {
    vp_jwt: string;
    effective_vc_subject: Principal;
    credential_spec: CredentialRequestSpec;
    issuer_origin: string;
}


export function prepareCallBackend(vp_jwt: string, caller: Principal, vcSpec: CredentialRequestSpec, issuerUrl: string){
    const req: ValidateVpRequest ={
        vp_jwt,
        effective_vc_subject: caller,
        credential_spec: vcSpec,
        issuer_origin: issuerUrl
     }

    // call the backend
    // callBackend(req)
}