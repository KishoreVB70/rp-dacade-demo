import "./styles.css";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

import requestVC from "./utils/credential";
import loginWithIdentity from "./utils/login";
import { State, getState } from "./utils/store";



const loginBtn = document.getElementById("login") as HTMLButtonElement | null;
const rpBtn = document.getElementById("rp") as HTMLButtonElement | null;
const princText = document.getElementById("princ") as HTMLParagraphElement  | null;
const tokenText = document.getElementById("token") as HTMLParagraphElement  | null;

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
    offset: {
      x: 0,
      y: -50,
    },
    backgroundColor: bg,
  }).showToast();
}


document.addEventListener("DOMContentLoaded", () => updateUI());

// Internet Identity login
loginBtn?.addEventListener("click", async() =>  {
  await loginWithIdentity();
  updateUI();
})

// Request credential
rpBtn?.addEventListener("click", async() => {
  try {
    let state:State = getState();
    await requestVC(state.userPrincipal, "ICP101", "John Doe");
    showToast("Verification completed", "#4CAF50");
    console.log(getState());
    updateUI();
  } catch(e) {
    console.log("Error in crendential process: ", e);
    showToast("Verification failed!", "#FF0000")
  }
});