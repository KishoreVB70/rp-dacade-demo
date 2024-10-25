import { getState } from "./store";
const batchRequest = {};


let identity = getState().userPrincipal;
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
