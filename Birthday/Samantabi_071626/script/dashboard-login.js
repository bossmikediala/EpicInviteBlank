(() => {
  const USERNAME = "samantabi";
  const PASSWORD = "samantabi083116";
  const LOGIN_STORAGE_KEY = "epicinvite:Samantabi_071626:dashboard-unlocked";
  const loginPanel = document.querySelector("#login-panel");
  const dashboard = document.querySelector("#dashboard");
  const loginForm = document.querySelector("#login-form");
  const loginMessage = document.querySelector("#login-message");
  let unlocked = false;

  function unlockDashboard() {
    unlocked = true;
    localStorage.setItem(LOGIN_STORAGE_KEY, "true");
    loginPanel.hidden = true;
    dashboard.hidden = false;
    window.dispatchEvent(new CustomEvent("epicinvite:dashboard-unlocked"));
  }

  function lockDashboard() {
    unlocked = false;
    localStorage.removeItem(LOGIN_STORAGE_KEY);
    dashboard.hidden = true;
    loginPanel.hidden = false;
    loginForm.reset();
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const data = new FormData(loginForm);
    const username = String(data.get("username")).trim().toLowerCase();
    const password = String(data.get("password"));

    if (location.protocol !== "file:") {
      history.replaceState({}, document.title, location.pathname);
    }

    if (username === USERNAME && password === PASSWORD) {
      loginMessage.textContent = "";
      unlockDashboard();
    } else {
      loginMessage.textContent = "Invalid username or password.";
    }
  });

  document.querySelector("#logout-button").addEventListener("click", lockDashboard);
  window.epicInviteDashboardUnlocked = () => unlocked;

  if (localStorage.getItem(LOGIN_STORAGE_KEY) === "true") {
    unlockDashboard();
  } else {
    lockDashboard();
  }
})();
