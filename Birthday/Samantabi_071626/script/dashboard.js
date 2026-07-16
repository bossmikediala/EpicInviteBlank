const PROJECT_ID = "Samantabi_071626";
const supabaseClient = window.epicInviteSupabase;
const dashboardMessage = document.querySelector("#dashboard-message");
const rows = document.querySelector("#rsvp-rows");
const emptyState = document.querySelector("#empty-state");
let submissions = [];

const formatDate = (value) => new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila"
}).format(new Date(value));

function renderRows(query = "") {
  const term = query.toLowerCase();
  const filtered = submissions.filter((item) =>
    item.name.toLowerCase().includes(term) || (item.email || "").toLowerCase().includes(term)
  );
  rows.replaceChildren(...filtered.map((item) => {
    const row = document.createElement("tr");
    const values = [
      item.name,
      item.email || "—",
      item.additional_guests,
      item.total_party_size,
      item.review_status === "manual_review" ? "Manual review" : "Received",
      formatDate(item.created_at)
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 4) {
        const badge = document.createElement("span");
        badge.className = `badge${item.review_status === "manual_review" ? " review" : ""}`;
        badge.textContent = value;
        cell.append(badge);
      } else cell.textContent = value;
      row.append(cell);
    });
    return row;
  }));
  emptyState.hidden = filtered.length > 0;
}

async function loadDashboard() {
  if (!window.epicInviteDashboardUnlocked?.()) return;
  dashboardMessage.textContent = "Loading current RSVP data…";
  const [{ data: project, error: projectError }, { data: rsvps, error: rsvpError }] = await Promise.all([
    supabaseClient.from("projects").select("*").eq("project_id", PROJECT_ID).single(),
    supabaseClient
      .from("rsvp_submissions")
      .select("id, project_id, name, email, additional_guests, total_party_size, review_status, created_at")
      .eq("project_id", PROJECT_ID)
      .order("created_at", { ascending: false })
  ]);

  if (projectError || rsvpError) {
    dashboardMessage.textContent = projectError?.message || rsvpError?.message;
    return;
  }

  submissions = (rsvps || []).filter((item) => item.project_id === PROJECT_ID);
  const used = submissions.reduce((sum, item) => sum + Number(item.total_party_size || 1), 0);
  const publicCapacity = project.total_seats - project.reserved_family_seats;
  const remaining = publicCapacity - used;

  document.querySelector("#total-seats").textContent = project.total_seats;
  document.querySelector("#family-seats").textContent = project.reserved_family_seats;
  document.querySelector("#remaining-seats").textContent = remaining;
  document.querySelector("#submission-count").textContent = submissions.length;
  document.querySelector("#rsvp-seats").textContent = used;
  const progressPercent = publicCapacity > 0
    ? Math.min(100, Math.max(0, (used / publicCapacity) * 100))
    : 0;
  const progressFill = document.querySelector("#progress-fill");
  const progressTrack = progressFill.parentElement;
  document.querySelector("#progress-used").textContent = used;
  document.querySelector("#progress-capacity").textContent = publicCapacity;
  document.querySelector("#progress-percent").textContent = `${Math.round(progressPercent)}%`;
  progressFill.style.width = `${progressPercent}%`;
  progressFill.classList.toggle("near-full", progressPercent >= 75 && progressPercent < 100);
  progressFill.classList.toggle("full", progressPercent >= 100);
  progressTrack.setAttribute("aria-valuenow", String(Math.round(progressPercent)));
  const capacityForm = document.querySelector("#capacity-form");
  capacityForm.elements.total_seats.value = project.total_seats;
  capacityForm.elements.reserved_family_seats.value = project.reserved_family_seats;
  dashboardMessage.textContent = remaining >= 0
    ? `${remaining} seats before the public RSVP allocation is full.`
    : `${Math.abs(remaining)} seats require manual review.`;
  renderRows();
}

document.querySelector("#refresh-button").addEventListener("click", loadDashboard);
document.querySelector("#search").addEventListener("input", (event) => renderRows(event.target.value));

document.querySelector("#capacity-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const total = Number(data.get("total_seats"));
  const family = Number(data.get("reserved_family_seats"));
  if (family > total) {
    dashboardMessage.textContent = "Family-reserved seats cannot exceed total seats.";
    return;
  }
  const { error } = await supabaseClient.from("projects").update({
    total_seats: total, reserved_family_seats: family, updated_at: new Date().toISOString()
  }).eq("project_id", PROJECT_ID);
  dashboardMessage.textContent = error ? error.message : "Seat settings saved.";
  if (!error) loadDashboard();
});

window.addEventListener("epicinvite:dashboard-unlocked", loadDashboard);

if (window.epicInviteDashboardUnlocked?.()) {
  loadDashboard();
}
