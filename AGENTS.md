# EpicInvite Project Instructions

This repository contains multiple EpicInvite client projects organized under two main project categories:

- `Birthday/`
- `Wedding/`

## Starting Work

At the beginning of every new client project, collect the required information below. Do not start generating the finished invitation until the intake is complete.

1. Ask for the project category:
   - Birthday
   - Wedding
2. Ask for the client name, then create the client directory automatically using `ClientName_MMDDYY`.
3. Ask for the event date, venue, and time. For Birthday projects, also ask for the celebrant's birthdate.
4. Ask the user to upload the celebrant's or couple's pictures. Save them in the project's `Assets/` directory.
5. Ask for the branding colors.
6. Ask for design references. References may be websites, screenshots, images, or other visual examples. Store uploaded reference files in `Reference/`.
7. Ask which RSVP form fields are required.

Do not repeat questions that the user has already answered. If the user provides only part of the intake, collect the remaining required details.

The event date and time must be used for a visible countdown section on the public invitation page. Confirm the event timezone if it is not clear from the venue.

## Post-Questionnaire Database Registration

Immediately after the questionnaire is complete, register the client project in the shared Supabase `projects` table. Do this before describing the RSVP form or dashboard as working.

Create or update the row using:

- `project_id`: the exact `ClientName_MMDDYY` directory identifier
- `client_name`: the client, celebrant, or couple name
- `event_type`: Birthday or Wedding
- `total_seats`: the questionnaire value
- `reserved_family_seats`: the questionnaire value

Use an upsert so rerunning the setup safely updates the intended project row without creating a duplicate.

After registration, query Supabase using the publishable client and verify:

- The exact `project_id` exists
- `total_seats` matches the questionnaire
- `reserved_family_seats` matches the questionnaire

Do not continue to final working-page verification or deployment if this database registration is missing or incorrect.

If Codex cannot update the Supabase `projects` table directly:

1. Clearly tell the user that database activation is pending.
2. Immediately provide a project-specific SQL upsert query that the user can paste into the Supabase SQL Editor.
3. Include the exact project ID, client name, event type, total seats, and family-reserved seats.
4. Ask the user to run the query.
5. After the user confirms, read the row back through Supabase and verify the saved values before considering the project active.

Minimum fallback query format:

```sql
insert into public.projects (
  project_id,
  client_name,
  event_type,
  total_seats,
  reserved_family_seats
)
values (
  'ClientName_MMDDYY',
  'Client Name',
  'Birthday or Wedding',
  100,
  10
)
on conflict (project_id) do update
set
  client_name = excluded.client_name,
  event_type = excluded.event_type,
  total_seats = excluded.total_seats,
  reserved_family_seats = excluded.reserved_family_seats,
  updated_at = now();
```

## Creating a New Client Project

For a new project:

1. Ask the user for the client's name if it has not already been provided.
2. Create the project directory inside the appropriate category folder.
3. Name the directory using:

   `ClientName_MMDDYY`

The date must be the date on which the project directory is created.

Example:

`Wedding/Michael_071625/`

In this example, `Michael` is the client's name and `071625` represents July 16, 2025.

Do not create a new client project directory until both the project category and client name are known.

## New Project Scaffold

Immediately after creating a new client project directory, initialize a working web project inside it.

The project must include:

- A public invitation and RSVP page, such as `index.html`
- A private RSVP dashboard page, such as `dashboard.html`
- An `Assets/` directory for project images, media, fonts, and other assets
- A `Reference/` directory for reference-page images manually uploaded by the user
- A `script/` directory for JavaScript files
- A `css/` directory for stylesheets
- An editable RSVP form section
- Supabase integration using the repository-wide configuration

Choose the filenames and project structure appropriate for the framework being used. Do not create an additional nested application directory unless the selected framework requires it.

Use plain HTML, CSS, and browser JavaScript by default. Do not add Vite, npm, bundlers, or a framework unless the user explicitly requests one. Load the Supabase browser library through its CDN and keep database code separate from the local dashboard-login script.

For a standard HTML project, create this structure automatically:

```text
ClientName_MMDDYY/
├── Assets/
├── Reference/
├── script/
├── css/
├── index.html
└── dashboard.html
```

The user will manually provide the reference-page image or images inside `Reference/`. Inspect those references before implementing or revising the invitation design.

## Required Client Pages

Every completed client project must provide two pages:

1. **Invitation and RSVP page** — the public page guests receive. It presents the invitation and submits RSVP responses to Supabase.
2. **RSVP dashboard** — the private page the client receives. It displays RSVP submissions and seat usage from Supabase.

By default, the dashboard uses a local script-based login and does not use Supabase Authentication.

The client-facing dashboard login uses:

- Default username: lowercase client name
- Default password: lowercase client name followed by the celebrant's birthdate in `MMDDYY`

Example:

```text
Client name: Samantabi
Birthdate: August 31, 2016
Username: samantabi
Temporary password: samantabi083116
```

Store these default credentials only in the individual project's dashboard JavaScript:

- Do not store dashboard credentials in Supabase.
- Do not create a database table for dashboard credentials.
- Do not use Supabase Authentication for the default dashboard login.
- Never store the username or password in browser storage.
- After a successful login, store only a project-scoped unlocked flag in `localStorage` so refreshing the dashboard does not require another login.
- Do not embed credentials directly in `dashboard.html`.

The login form must use JavaScript-only submission, prevent the browser's default form submission, and never place the username or password in the URL. The unlocked state persists across refreshes until the client explicitly locks the dashboard or clears browser data.

This local login is only a lightweight client-side access screen, not secure database authentication. Because browser JavaScript is inspectable, a technical user can discover the credentials. Never place Supabase service-role keys, database passwords, or other privileged secrets in the dashboard script.

At minimum, the dashboard should show:

- Total configured seats
- Seats reserved for the celebrant's or couple's family
- Seats available to public RSVP guests
- Total seats reserved
- Remaining seats
- Total RSVP submissions
- Guest names
- Enabled optional response fields
- Submission date and time
- A compact milestone/status area, such as `43 seats before full`

Ask the user whether any additional dashboard features are needed, such as search, filtering, editing, deletion, attendance status, CSV export, or manual RSVP entry.

The dashboard must allow the locally authenticated client or administrator to set and save:

- Total venue seat capacity
- Number of seats reserved for family

These values are stored in the shared `projects` table for the current `project_id`.

Calculate public RSVP availability as:

```text
public RSVP capacity = total seats - family-reserved seats
remaining seats = public RSVP capacity - submitted RSVP party sizes
```

The dashboard milestone area must update from current database values and show at least:

- Remaining seats before the public RSVP allocation is full
- Number of RSVP submissions
- Number of seats represented by those submissions

## RSVP Form Requirements

Every RSVP form must include:

- Name — required

The following fields are optional project features:

- Email
- Phone number
- Number of people attending with the guest

Before building a new project's form, ask the user which optional fields should be included unless the user has already specified them.

Form fields must remain easy to edit for the needs of an individual invitation.

Before saving an RSVP, display this confirmation:

```text
Are you sure? After submitting, you will not be able to edit your RSVP again.
```

After a successful submission, save a project-scoped completion flag in `localStorage`, hide the form on that browser, and show a response-received message. Do not set the flag when the database submission fails or the guest cancels the confirmation.

The completed RSVP state must:

- Remove the form and RSVP introduction from view completely
- Show only a centered thank-you card within the RSVP section
- Remain active after refresh or reopening on the same browser
- Never hide the form before Supabase confirms a successful insert

## Default Implementation Rules

Apply the finalized EpicInvite behavior consistently to every new Birthday and Wedding project:

- Use plain HTML, CSS, and browser JavaScript unless the user explicitly requests another stack.
- Use the shared root Supabase configuration and the two shared SQL tables.
- Keep each project isolated through its `ClientName_MMDDYY` project ID.
- Keep dashboard login credentials only in a separate project login script.
- Never put dashboard credentials in HTML, URLs, Supabase, or database tables.
- Store only a project-specific unlocked flag in `localStorage`.
- Load RSVP and dashboard database logic from scripts separate from the login script.
- Query dashboard submissions using an explicit `project_id` filter.
- Display guest name, enabled contact fields, additional guests, total party size, status, and submission time.
- Display total seats, family-reserved seats, public RSVP capacity, occupied RSVP seats, remaining seats, and submission count.
- Display a full-width colored progress bar showing occupied RSVP seats out of public RSVP capacity.
- Ask for final confirmation before submitting an RSVP.
- Hide the complete RSVP form after successful submission and center the thank-you state.

When an existing rule is improved during one client project, update these repository instructions so the improvement becomes the default for future projects.

## Git Commit and Push Rules

Do not commit or push changes automatically during normal project work.

Commit and push only in either of these situations:

1. The user explicitly asks to commit, push, or deploy the current changes.
2. The user says the project is `finished` or says `finish` after the complete project setup and required verification are done.

When the user says a project is finished:

1. Run the project's Supabase setup SQL or confirm that the user has run it.
2. Verify through the Supabase API that the exact project ID exists in `projects` with the intended total and family-reserved seat values. Do not deploy or describe the RSVP as working while this row is absent.
3. Verify the invitation page, RSVP submission, dashboard, project filtering, and responsive layout as applicable.
4. Confirm that private files and secrets are excluded from Git.
5. Commit all intended project files and documentation changes.
6. Push the commit to the current tracked branch, normally `main`.
7. If the project is already connected to Vercel, deploy or verify the production deployment.
8. Report the commit, branch, and live page links.

Do not create intermediate commits or push unfinished project work unless the user explicitly requests it.

## Project Data Requirements

All client projects use the same repository-wide Supabase project and exactly two shared SQL tables. Store Supabase configuration in the repository root, not inside individual client directories.

Use two SQL tables:

1. A projects or capacity table containing one row per client project and its manually configured total number of seats.
2. An RSVP submissions table containing responses for all client projects.

Use the client directory identifier, such as `Testsam_071626`, as the unique project ID. The projects table uses this identifier as its primary key. The RSVP table stores the same identifier as a foreign key so submissions can be filtered for the correct client dashboard.

The RSVP table must always store the guest's name. It should store email, phone number, and party size only when those fields are enabled for that project. Every form submission and dashboard query must be scoped to the current project ID.

Enable Row Level Security and define appropriate policies before allowing browser-based access. Never expose a Supabase service-role key in client-side code.

The application should calculate remaining availability from the configured seat capacity and accepted RSVP party sizes. Seat-limit behavior must be confirmed with the user before implementation, including whether to reject, warn about, or allow submissions that exceed the remaining capacity.
