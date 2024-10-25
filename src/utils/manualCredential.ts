import { issuer_canister_id, issuer_url } from "./constants";
import { getState } from "./store";

type VcFlowRequest = {
    id: number | string;
    jsonrpc: "2.0"; // Literal type for jsonrpc field
    method: "request_credential"; // Literal type for method field
    params: {
      issuer: {
        origin: string;
        canisterId: string;
      };
      credentialSpec: {
        credentialType: string;
        arguments: Record<string, string | number>;
      };
      credentialSubject: string;
      derivationOrigin?: string;
    };
};

function createOneRequest(course: string, identity: string): VcFlowRequest {
    return {
        id: 1,
        jsonrpc: "2.0",
        method: "request_credential",
        params: {
            issuer: {
                origin: issuer_url,
                canisterId:  issuer_canister_id,
            },
            credentialSpec: {
                credentialType: `Verified ${course} course completion in dacade`,
                arguments: {
                    "course": `${course}`
                }
            },
            credentialSubject: identity,
        }
    }
}

function createBatchRequest(): VcFlowRequest[] {
    let state = getState();
    let identity = state.userPrincipal;
    let req1: VcFlowRequest = createOneRequest(
        "TS101",
        identity
    )
    let req2: VcFlowRequest = createOneRequest(
        "TS201",
        identity
    )

    let req: VcFlowRequest[] = [req1, req2];
    return req;
}

async function handleFlowFinished(event: MessageEvent) {
    try {
      console.log("Received final output: ", event);

      if (
        event.source &&
        "close" in event.source &&
        typeof event.source.close === "function"
      ) {
        event.source.close();
      }
      window.removeEventListener("message", handleFlowFinished);
    } catch (e) {
        console.log("Error in credential process; ", e);
    }
}

async function handleFlowReady(event: MessageEvent) {
    let state = getState();
    let identity = state.userPrincipal;
    console.log("Received first contact", event);
    if (!identity || event.origin !== "https://identity.internetcomputer.org" || event.data.method !== "vc-flow-ready") {
        console.log("Rejecting message");
        return;
    }

    try {
        window.addEventListener("message", handleFlowFinished);
        console.log("Calling with the input");
        let batchRequest: VcFlowRequest[] = createBatchRequest();
        let oneReq: VcFlowRequest = createOneRequest("TS101",identity);
        event.source?.postMessage(oneReq, {
            targetOrigin: event.origin,
        });
    } finally {
        window.removeEventListener("message", handleFlowReady);
    }
}

export async function startVcFlow() {
    console.log("Started vc flow");
    window.addEventListener("message", handleFlowReady);
    window.open("https://identity.internetcomputer.org/vc-flow/");
}
