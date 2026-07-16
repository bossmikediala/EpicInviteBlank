const PROJECT_ID = "Samantabi_071626";
const supabaseClient = window.epicInviteSupabase;
const SUBMITTED_STORAGE_KEY = `epicinvite:${PROJECT_ID}:rsvp-submitted`;
const EVENT_TIME = new Date("2026-08-31T15:00:00+08:00").getTime();
const form = document.querySelector("#rsvp-form");
const message = document.querySelector("#form-message");
const completeMessage = document.querySelector("#rsvp-complete");
const rsvpSection = document.querySelector("#rsvp");

function showCompletedState() {
  form.hidden = true;
  completeMessage.hidden = false;
  rsvpSection.classList.add("is-complete");
}

if (localStorage.getItem(SUBMITTED_STORAGE_KEY) === "true") {
  showCompletedState();
}

function updateCountdown() {
  const distance = Math.max(0, EVENT_TIME - Date.now());
  const units = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };

  Object.entries(units).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  const button = form.querySelector("button");
  const data = new FormData(form);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const additionalGuests = Number(data.get("additional_guests"));

  message.className = "form-message";
  message.textContent = "";

  if (!name || !email || !Number.isInteger(additionalGuests) || additionalGuests < 0) {
    message.classList.add("error");
    message.textContent = "Please complete all fields correctly.";
    return;
  }

  const confirmed = window.confirm(
    "Are you sure? After submitting, you will not be able to edit your RSVP again."
  );
  if (!confirmed) return;

  button.disabled = true;
  button.textContent = "Sending…";

  try {
    if (!supabaseClient) {
      throw new Error("The RSVP connection is not initialized.");
    }

    const { error } = await supabaseClient.from("rsvp_submissions").insert({
      project_id: PROJECT_ID,
      name,
      email,
      additional_guests: additionalGuests
    });

    if (error) throw error;

    form.reset();
    form.elements.additional_guests.value = 0;
    localStorage.setItem(SUBMITTED_STORAGE_KEY, "true");
    showCompletedState();
  } catch (error) {
    message.classList.add("error");
    message.textContent = error.message?.includes("foreign key")
      ? "This invitation is not activated in the database yet."
      : `We could not save your RSVP: ${error.message || "connection failed"}`;
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = "Send my RSVP";
  }
});
