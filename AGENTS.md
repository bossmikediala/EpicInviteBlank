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
3. Ask for the event date, venue, and time.
4. Ask the user to upload the celebrant's or couple's pictures. Save them in the project's `Assets/` directory.
5. Ask for the branding colors.
6. Ask for design references. References may be websites, screenshots, images, or other visual examples. Store uploaded reference files in `Reference/`.
7. Ask which RSVP form fields are required.

Do not repeat questions that the user has already answered. If the user provides only part of the intake, collect the remaining required details.

The event date and time must be used for a visible countdown section on the public invitation page. Confirm the event timezone if it is not clear from the venue.

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

The dashboard must not expose RSVP data publicly. Add authentication or another approved access-control method before delivery. Public browser code must never contain administrator or Supabase service-role credentials.

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

The dashboard must allow the authorized client or administrator to set and save:

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

## Project Data Requirements

All client projects use the same repository-wide Supabase project and exactly two shared SQL tables. Store Supabase configuration in the repository root, not inside individual client directories.

Use two SQL tables:

1. A projects or capacity table containing one row per client project and its manually configured total number of seats.
2. An RSVP submissions table containing responses for all client projects.

Use the client directory identifier, such as `Testsam_071626`, as the unique project ID. The projects table uses this identifier as its primary key. The RSVP table stores the same identifier as a foreign key so submissions can be filtered for the correct client dashboard.

The RSVP table must always store the guest's name. It should store email, phone number, and party size only when those fields are enabled for that project. Every form submission and dashboard query must be scoped to the current project ID.

Enable Row Level Security and define appropriate policies before allowing browser-based access. Never expose a Supabase service-role key in client-side code.

The application should calculate remaining availability from the configured seat capacity and accepted RSVP party sizes. Seat-limit behavior must be confirmed with the user before implementation, including whether to reject, warn about, or allow submissions that exceed the remaining capacity.
