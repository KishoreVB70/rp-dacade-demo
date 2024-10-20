import "./styles.css";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { jwtDecode } from "jwt-decode";
import requestVC from "./utils/credential";
import loginWithIdentity from "./utils/login";
import { State, getState } from "./utils/store";

// Login
const loginBtn = document.getElementById("login") as HTMLButtonElement;
const princText = document.getElementById("princ") as HTMLParagraphElement  | null;

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
  await loginWithIdentity();
  dropDown.style.display = "inline-block";
  updateUI();
})

// Request credential
rpBtn.addEventListener("click", async() => {
  try {
    let state:State = getState();
    if (!selectedCourse) {
      showToast("Please select a course from the dropdown", "#FF0000");
      return;
    }
    let token: any = await requestVC(state.userPrincipal, selectedCourse, "John Doe");
    showToast("Verification completed", "#4CAF50");
    console.log(getState());
    updateUI();
  } catch(e) {
    console.log("Error in crendential process: ", e);
    showToast("Verification failed!", "#FF0000")
  }
});