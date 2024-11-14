import "./styles.css";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import requestVC from "./utils/credential";
import loginWithIdentity, {logout} from "./utils/login";
import { State, getState, updateState } from "./utils/store";
import { renderCredential } from "./utils/decodeCredentialUI";
import {issuer_canister_id} from "./utils/constants";
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory as issuerIDL} from "./issuer";

if (typeof global === 'undefined') {
  window.global = window;
}

// Login
const loginBtn = document.getElementById("login") as HTMLButtonElement;
const princText = document.getElementById("princ") as HTMLParagraphElement  | null;
const verifyBtn = document.getElementById("verifybtn") as HTMLButtonElement;
const loadingElement = document.getElementById('loading');
const profilePic = document.getElementById("profile-pic") as HTMLDivElement | null;
const credentialBadge = document.getElementById("credential-badge") as HTMLDivElement | null;
const rpText = document.getElementById("rp-text");
const rpLoader = document.getElementById("rp-loader");

// Drop Down
let selectedCourse: string = '';
const menuButton = document.getElementById('menu-button') as HTMLElement;

// Credential
const tokenText = document.getElementById("token") as HTMLParagraphElement  | null;
const rpBtn = document.getElementById("rp") as HTMLButtonElement;
const createBtn = document.getElementById("createcred") as HTMLButtonElement;
const currentYear = document.getElementById('currentYear')

currentYear.innerText = `${new Date().getFullYear()}`

const principal = getState().userPrincipal

rpBtn.disabled = !principal

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

  rpBtn.disabled = !state.userPrincipal
  // Toggle buttons based on login state
  toggleVisibility(verifyBtn, !!state.token)
  toggleVisibility(loginBtn, !state.userPrincipal);
  toggleVisibility(profilePic, !!state.userPrincipal)

  // Update token text and visibility
  const tokenDisplayText = state.verificationState
    ? `${state.verificationState} Issued by ${state.issuer}`
    : "";
  updateInnerText(tokenText, tokenDisplayText);
  toggleVisibility(tokenText, !!state.verificationState);
  toggleVisibility(credentialBadge, state.hasCompletedTheCourse);
  toggleVisibility(rpBtn, !state.hasCompletedTheCourse)
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

console.log({loginBtn})
// Internet Identity login
loginBtn.addEventListener("click", async() =>  {
  let princi = await loginWithIdentity();
  console.log("User principal: ", princi);
  // dropDown.style.display = "inline-block";
  updateUI();
})

// Request credential
// rpBtn.addEventListener("click", async() => {
//   try {
//     let state:State = getState();
//
//     let token: any = await requestVC(state.userPrincipal, "TS101");
//     showToast("Credenetial Obtained", "#4CAF50");
//     console.log(getState());
//     renderCredential(token);
//     updateUI();
//
//   } catch(e) {
//     console.log("Error in crendential process: ", e);
//     showToast("Verification failed!", "#FF0000")
//   }
// });


profilePic.addEventListener("click", async () => {
  await logout()
  updateState({})
  updateUI()
  location.reload()
})


rpBtn.addEventListener("click", async() => {
  try {
    let state:State = getState();
    if(state.identity == null) {
      return;
    }
    if(rpText) {
      rpText.style.display = "none"
    }
    if(rpLoader) {
      rpLoader.style.display = "block"
    }


    const agent = new HttpAgent({ host: 'https://ic0.app', identity: state.identity });
    console.log(agent);

    // Create an actor that allows you to interact with the canister
    const actor = Actor.createActor(issuerIDL, {
      agent,
      canisterId: issuer_canister_id,
    });

    let result = await actor.add_course_completion("TS101");
    state.hasCompletedTheCourse = true;

    updateUI()
    console.log(result);
    if (result) showToast("Credential successfully created", "#4CAF50");
  }
  catch(error) {
    console.log("Error creating credential: ", error);
    showToast("Error in credential creation!", "#FF0000");
  } finally {
    if(rpLoader) {
      rpLoader.style.display = "none"
    }
  }
})
