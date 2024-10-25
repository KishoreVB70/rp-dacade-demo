import "./styles.css";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import requestVC from "./utils/credential";
import loginWithIdentity from "./utils/login";
import { State, getState, updateState } from "./utils/store";
import { renderCredential } from "./utils/decodeCredentialUI";
import { Principal } from "@dfinity/principal";
import { CredentialSpec, ValidateVpRequest } from "./relying_party/relying_party.did";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./rpdemo_backend";
import { startVcFlow } from "./utils/manualCredential";

if (typeof global === 'undefined') {
  window.global = window;
}

// Login
const loginBtn = document.getElementById("login") as HTMLButtonElement;
const princText = document.getElementById("princ") as HTMLParagraphElement  | null;
const verifyBtn = document.getElementById("verifybtn") as HTMLButtonElement;
const loadingElement = document.getElementById('loading');


// Drop Down
let selectedCourse: string = '';
const menuButton = document.getElementById('menu-button') as HTMLElement;
const dropDown = document.getElementById('drop-down') as HTMLElement;
const dropdownMenu = menuButton.nextElementSibling as HTMLElement;
const menuItems = dropdownMenu.querySelectorAll('a');
// Toggle dropdown visibility on button click
menuButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('hidden');
});
// Update selectedCourse when a dropdown item is clicked
menuItems.forEach((item) => {
  item.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    selectedCourse = target.textContent || ''; // Store the selected course text
    menuButton.textContent = `Selected Course: ${selectedCourse}`; // Optionally update button text
    dropdownMenu.classList.add('hidden');
  });
});

// Credential
const tokenText = document.getElementById("token") as HTMLParagraphElement  | null;
const rpBtn = document.getElementById("rp") as HTMLButtonElement;

// Helper function to toggle the visibility of an element
const toggleVisibility = (element: HTMLElement | null, show: boolean): void => {
  if (!element) return;
  element.style.display = show ? "block" : "none";
};

// Helper function to update inner text
const updateInnerText = (element: HTMLElement | null, text: string): void => {
  if (!element) return;
  element.innerText = text;
};

const updateUI = () => {
  const state:State = getState();

  // Update principal text
  let principal: string = state.userPrincipal 
    ? `User Principal: ${state.userPrincipal.slice(0, 4)}...${state.userPrincipal.slice(-3)}` 
    : "User Not logged in";
  updateInnerText(princText, principal);
  
  
  // Toggle buttons based on login state
  toggleVisibility(verifyBtn, !!state.token)
  toggleVisibility(loginBtn, !state.userPrincipal);
  toggleVisibility(rpBtn, !!state.userPrincipal);

  // Update token text and visibility
  const tokenDisplayText = state.verificationState
    ? `${state.verificationState} Issued by ${state.issuer}`
    : "";
  updateInnerText(tokenText, tokenDisplayText);
  toggleVisibility(tokenText, !!state.verificationState);
}

const showToast = (text: string , bg: string): void => {
  Toastify({
    text: text,
    duration: 3000,  
    gravity: "bottom", 
    position: "center",
    style: {
      background: bg,
    },
  }).showToast();
}

document.addEventListener("DOMContentLoaded", () => updateUI());

// Internet Identity login
loginBtn.addEventListener("click", async() =>  {
  let princi = await loginWithIdentity();
  console.log("User principal: ", princi);
  dropDown.style.display = "inline-block";
  updateUI();
})

// Request credential
// rpBtn.addEventListener("click", async() => {
//   try {
//     let state:State = getState();
//     if (!selectedCourse) {
//       showToast("Please select a course from the dropdown", "#FF0000");
//       return;
//     }
//     let token: any = await requestVC(state.userPrincipal, selectedCourse);
//     showToast("Credenetial Obtained", "#4CAF50");
//     console.log(getState());
//     renderCredential(token);
//     updateUI();

//   } catch(e) {
//     console.log("Error in crendential process: ", e);
//     showToast("Verification failed!", "#FF0000")
//   }
// });

rpBtn.addEventListener("click", async() => {
  try {
    await startVcFlow();
    showToast("Credential Obtained", "#4CAF50");
  } catch(e) {
    console.log("Error in crendential process: ", e);
    showToast("Verification failed!", "#FF0000");
  }
});


// Verify credential
verifyBtn.addEventListener("click", async() => {
  try {
    loadingElement?.classList.remove('hidden');
    let state:State = getState();
    let issuerUrl = "https://dacade.org/";
    const vc_spec_backend: CredentialSpec = {
      credential_type: `Verified ${selectedCourse} completion on Dacade`,
      arguments: [
        [
          ["course", { 'String': selectedCourse }],
        ]
      ]
    }
    let req: ValidateVpRequest = {
      effective_vc_subject: Principal.fromText(state.userPrincipal),
      credential_spec: vc_spec_backend,
      issuer_origin: issuerUrl,
      vp_jwt: state.token,
    }
    // let actor = createActor("bkyz2-fmaaa-aaaaa-qaaaq-cai");
    //---------------------------
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    
    // Create an actor that allows you to interact with the canister
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: 'dqblg-3qaaa-aaaap-akprq-cai',
    });
    //--------------------------
    console.log(actor);
    let result = await actor.validate_vc_token_allinputs(req);
    console.log("Result from backend: ", result);
    showToast("Verification Succesfull", "#4CAF50");
    let verificationState = `Successfully Verified ${selectedCourse} completion on Dacade`
    updateState({
      verificationState: verificationState,
    })
    updateUI();
  } catch(e) {
    console.log("Error in verification process: ", e);
    showToast("Verification failed!", "#FF0000")
  } finally {
    loadingElement?.classList.add('hidden');
  }
});