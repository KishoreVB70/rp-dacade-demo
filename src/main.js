import "./styles.css";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

import requestVC from "./utils/credential";
import loginWithIdentity from "./utils/login";
import { getState } from "./utils/store";


const loginBtn = document.getElementById("login");
const rpBtn = document.getElementById("rp");
const princText = document.getElementById("princ");
const tokenText = document.getElementById("token");


const updateUI = () => {
  let state = getState();
  princText.innerText = state.userPrincipal
    ?`User Principal: ${state.userPrincipal.slice(0, 4)}...${state.userPrincipal.slice(-3)}`
    :"User Not logged in";
  if (state.userPrincipal) {
    loginBtn.style.display = "none";
    rpBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";  
    rpBtn.style.display = "none";
  }

  if (state.verificationState) {
    tokenText.style.display = "block";
    tokenText.innerHTML = state.verificationState
    ?`${state.verificationState} Issued by ${state.issuer}`
    : "";
  } else tokenText.style.display = "none";

}

const showToast = (text, bg) => {
  Toastify({
    text: text,
    duration: 3000,  
    gravity: "bottom", 
    position: "center",
    offset: {
      y: -50,
    },
    backgroundColor: bg,
  }).showToast();
}


document.addEventListener("DOMContentLoaded", () => updateUI());

// Internet Identity login
loginBtn.addEventListener("click", async() =>  {
  await loginWithIdentity();
  updateUI();
})

// Request credential
rpBtn.addEventListener("click", async() => {
  try {
    let state = getState();
    await requestVC(state.userPrincipal, "ICP101", "John Doe");
    showToast("Verification completed", "#4CAF50");
    console.log(getState());
    updateUI();
  } catch(e) {
    console.log("Error in crendential process: ", e);
    showToast("Verification failed!", "#FF0000")
  }
});

