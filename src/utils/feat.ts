import { jwtDecode } from "jwt-decode";
import { Principal } from "@dfinity/principal";

/**
 * REQUEST CREDENTIAL LOGIC
 */
const vcContainer = document.getElementById("vc-container");

const showVcContainer = () => {
  vcContainer?.classList.remove("hidden");
  vcContainer?.classList.remove("sm:hidden");
  vcContainer?.classList.add("sm:grid");
};

const hideVcContainer = () => {
  vcContainer?.classList.add("hidden");
  vcContainer?.classList.add("sm:hidden");
  vcContainer?.classList.remove("sm:grid");
};



/**
 * DECODE CREDENTIAL LOGIC
 */
const credentialErrorElement = document.getElementById("credential-error");
const vcResultElement = document.getElementById("vc-result");
const decodeCredentialPresentationButton = document.getElementById(
  "decode-credential-presentation-button"
);
const copyCredentialPresentationButton = document.getElementById(
  "copy-credential-presentation-button"
);
const decodedCredentialPresentation =
  document.getElementById("vc-presentation");
const decodedCredentialPresentationContainer = document.getElementById(
  "vc-presentation-container"
);
const decodedAliasContainer = document.getElementById("vc-alias-container");
const decodedAliasElement = document.getElementById("vc-alias");
const decodeAliasButton = document.getElementById("decode-alias-button");
const decodeCredentialButton = document.getElementById(
  "decode-credential-button"
);
const copyAliasButton = document.getElementById("copy-alias-button");
const copyCredentialButton = document.getElementById("copy-credential-button");
const decodedCredentialContainer = document.getElementById(
  "vc-credential-container"
);
const decodedCredentialElement = document.getElementById("vc-credential");

// Functions to render the decoded credential.
const renderDecodedCredential = (jwt: string) => {
  if (decodedCredentialContainer && decodedCredentialElement) {
    decodedCredentialContainer.classList.remove("hidden");
    decodedCredentialContainer.classList.add("flex");
    decodedCredentialElement.innerText = JSON.stringify(
        jwtDecode(jwt),
      null,
      2
    );
    window.scrollTo({
      top: decodedCredentialContainer.offsetTop,
      behavior: "smooth",
    });
  }
};

const renderDecodedAlias = (jwt: string) => {
  if (decodedAliasContainer && decodedAliasElement) {
    decodedAliasContainer.classList.remove("hidden");
    decodedAliasContainer.classList.add("flex");
    decodedAliasElement.innerText = JSON.stringify(jwtDecode(jwt), null, 2);
    window.scrollTo({
      top: decodedAliasContainer.offsetTop,
      behavior: "smooth",
    });
  }
};

const renderDecodedCredentialPresentation = (jwt: string) => {
  if (decodedCredentialPresentation && decodedCredentialPresentationContainer) {
    const decodedPresentation = jwtDecode(jwt) as any;
    decodedCredentialPresentationContainer.classList.remove("hidden");
    decodedCredentialPresentationContainer.classList.add("flex");
    decodedCredentialPresentation.innerText = JSON.stringify(
      decodedPresentation,
      null,
      2
    );
    window.scrollTo({
      top: decodedCredentialPresentationContainer.offsetTop,
      behavior: "smooth",
    });

    const [alias, credential] = decodedPresentation.vp.verifiableCredential;
    decodeAliasButton?.addEventListener("click", () => {
      renderDecodedAlias(alias);
    });
    decodeCredentialButton?.addEventListener("click", () => {
      renderDecodedCredential(credential);
    });
    copyAliasButton?.addEventListener("click", () => {
      navigator.clipboard.writeText(alias);
    });
    copyCredentialButton?.addEventListener("click", () => {
      navigator.clipboard.writeText(credential);
    });
  }
};

export const renderCredential = (jwt: string) => {
  showVcContainer();
  if (credentialErrorElement) {
    credentialErrorElement.innerText = "";
  }
  if (vcResultElement && vcContainer) {
    vcResultElement.innerText = jwt;
    window.scrollTo({ top: vcContainer.offsetTop, behavior: "smooth" });
  }

  decodeCredentialPresentationButton?.addEventListener("click", () => {
    renderDecodedCredentialPresentation(jwt);
  });

  copyCredentialPresentationButton?.addEventListener("click", () => {
    navigator.clipboard.writeText(jwt);
  });
};

const renderError = (error: string | undefined) => {
  console.log("Error obtaining credential", error);
  hideVcContainer();
  if (credentialErrorElement) {
    credentialErrorElement.innerText = `There was an error obtaining the credential: ${error}`;
  }
}