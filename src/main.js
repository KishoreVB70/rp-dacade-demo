import "./styles.css";
import requestVC from "./utils/credential";
import loginWithIdentity from "./utils/login";
import { getState } from "./utils/store";

let state = getState();
const loginBtn = document.getElementById("login");
const rpBtn = document.getElementById("rp");
const princText = document.getElementById("princ");
const tokenText = document.getElementById("token");


const updateUI = () => {
  state = getState();
  princText.innerText = state.userPrincipal;
  tokenText.innerHTML = state.verificationState;
}


document.addEventListener("DOMContentLoaded", () => updateUI());

// Internet Identity login
loginBtn.addEventListener("click", async() =>  
  {
    await loginWithIdentity();
    updateUI();
  })

// Request credeintial
rpBtn.addEventListener("click", async() => {
  await requestVC(state.userPrincipal, "ICP101", "Jonathan");
  console.log(getState());
  updateUI();
});

