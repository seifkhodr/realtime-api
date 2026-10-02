import ApiBuilder from "./apiBuilder.js";

const SESSION_KEY = "gather-session";

// redirect if already logged in
if (localStorage.getItem(SESSION_KEY)) {
  window.location.href = "/";
}

const api = new ApiBuilder();

// ── current mode: "login" or "signup" ────────────────────────────────────────
let mode = "login";

// ── grab all the elements we need ────────────────────────────────────────────
const signupFields = document.getElementById("signup-fields");
const formEyebrow  = document.getElementById("form-eyebrow");
const formTitle    = document.getElementById("form-title");
const btnLogin     = document.getElementById("btn-login");
const btnSignup    = document.getElementById("btn-signup");
const btnSubmit    = document.getElementById("btn-submit");
const formError    = document.getElementById("form-error");
const authForm     = document.getElementById("auth-form");

// ── switch to login mode ──────────────────────────────────────────────────────
function showLogin() {
  mode = "login";

  // toggle the extra signup fields off (CSS transition handles animation)
  signupFields.style.display = "none";

  // update the text at the top of the card
  formEyebrow.textContent = "Welcome back";
  formTitle.textContent   = "Come on in.";
  btnSubmit.textContent   = "Enter Gather";

  // highlight the active tab
  btnLogin.classList.add("active");
  btnSignup.classList.remove("active");

  hideError();
}

// ── switch to signup mode ─────────────────────────────────────────────────────
function showSignup() {
  mode = "signup";

  signupFields.style.display = "block";

  formEyebrow.textContent = "Create your space";
  formTitle.textContent   = "Start your circle.";
  btnSubmit.textContent   = "Create account";

  btnSignup.classList.add("active");
  btnLogin.classList.remove("active");

  hideError();
}

// ── show / hide error message ─────────────────────────────────────────────────
function showError(msg) {
  formError.textContent   = msg;
  formError.style.display = "block";
}

function hideError() {
  formError.style.display = "none";
}

// ── handle form submit ────────────────────────────────────────────────────────
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  // collect all named inputs into a plain object
  const data = Object.fromEntries(new FormData(authForm).entries());
  if (data.age) data.age = Number(data.age);

  btnSubmit.disabled    = true;
  btnSubmit.textContent = "Please wait…";

  try {
    const session = mode === "login"
      ? await api.auth.login({ email: data.email, password: data.password })
      : await api.auth.register(data);

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.location.href = "/";

  } catch (err) {
    showError(err.message);
    btnSubmit.disabled    = false;
    btnSubmit.textContent = mode === "login" ? "Enter Gather" : "Create account";
  }
});

// ── tab buttons ───────────────────────────────────────────────────────────────
btnLogin.addEventListener("click",  showLogin);
btnSignup.addEventListener("click", showSignup);
