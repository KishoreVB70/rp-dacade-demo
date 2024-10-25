import { issuer_canister_id, issuer_url } from "./constants";
import { getState } from "./store";
let identity: string = getState().userPrincipal;

const batchRequest = [
    {
        id: 1,
        jsonrpc: "2.0",
        method: "request_credential",
        params: {
            issuer: {
                origin: issuer_url,
                canisterId:  issuer_canister_id,
            },
            credentialSpec: {
                credentialType: "Verified TS101 completion on Dacade",
                arguments: {
                    "course": "TS101",
                },
            },
            credentialSubject: identity,
        }
    },
    {
        id: 2,
        jsonrpc: "2.0",
        method: "request_credential",
        params: {
            issuer: {
                origin: issuer_url,
                canisterId:  issuer_canister_id,
            },
            credentialSpec: {
                credentialType: "Verified T2101 completion on Dacade",
                arguments: {
                    "course": "TS201",
                },
            },
            credentialSubject: identity,
        }
    },
]


async function handleFlowFinished(event: MessageEvent) {
    try {
      console.log(event);

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
    if (!identity || event.origin !== "https://identity.ic0.app" || event.data.method !== "vc-flow-ready") {
        return;
    }

    try {
        window.addEventListener("message", handleFlowFinished);
        event.source?.postMessage(batchRequest, {
            targetOrigin: event.origin,
        });
    } finally {
        window.removeEventListener("message", handleFlowReady);
    }
}

export async function startVcFlow() {
    const vcFlowUrl = new URL("vc-flow/", process.env.II_URL);
    window.addEventListener("message", handleFlowReady);
    window.open(vcFlowUrl.toString());
}
