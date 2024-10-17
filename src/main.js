import "./styles.css";

import requestVC from "./utils/credential";
import loginWithIdentity from "./utils/login";

let userPrincipal;
const loginBtn = document.getElementById("login");
const rpBtn = document.getElementById("rp");
const princText = document.getElementById("princ");

// Internet Identity login
loginBtn.addEventListener("click", async() =>  
  {
    userPrincipal = await loginWithIdentity();
    princText.innerText = "User Principal: " + userPrincipal;
    console.log("User Principal: ", userPrincipal);
  })

// Request credeintial
rpBtn.addEventListener("click", () => {
  requestVC(
    userPrincipal,
    "ICP101",
    "Jonathan"
  );
});