# EpicInvite New Project Scaffold

This document defines what must be created inside every new Birthday or Wedding client project.

## Creation Workflow

Before creating the project, collect:

1. Project category: Birthday or Wedding
2. Client name
3. Event date
4. Celebrant's birthdate for Birthday projects
5. Event venue
6. Event time and timezone
7. Celebrant or couple pictures for `Assets/`
8. Branding colors
9. Website, screenshot, or image references for `Reference/`
10. RSVP fields to include:
   - Email
   - Phone number
   - Number of people attending with the guest
11. Total seat capacity, if it is already known
12. Family-reserved seats, if already known
13. What should happen when an RSVP exceeds the remaining seat capacity

Do not ask again for details the user has already supplied.

## Questionnaire Completion Action

Once all required questionnaire answers are known, immediately create or update the project's shared Supabase record before considering the setup complete.

Required row:

```text
projects.project_id = ClientName_MMDDYY
projects.client_name = client, celebrant, or couple name
projects.event_type = Birthday or Wedding
projects.total_seats = confirmed total venue seats
projects.reserved_family_seats = confirmed family-reserved seats
```

Use an upsert and then read the row back through Supabase to verify the exact project ID and seat values. The RSVP trigger and dashboard depend on this row; without it, submissions return `Invalid project ID` and dashboard capacity cannot load.

If Codex cannot write to Supabase directly, generate the project-specific SQL immediately and explicitly mark database activation as pending until the user runs it.

The client directory follows this format:

```text
Category/ClientName_MMDDYY/
```

Example:

```text
Wedding/Michael_071625/
```

## Web Application

Initialize a deployable plain HTML, CSS, and JavaScript application directly inside the client directory. Do not add Vite, npm, a bundler, or a framework unless explicitly requested. It must provide:

- A main invitation page
- A private RSVP dashboard
- An editable RSVP section
- Client-side form validation
- A connection to the shared repository-wide Supabase project
- Clear success and error feedback after submission
- Responsive behavior for phones and desktop browsers

Use `index.html` as the public entry page and load Supabase's browser library through its CDN.

## Standard Directory Structure

For a standard HTML invitation, automatically create:

```text
ClientName_MMDDYY/
├── Assets/
├── Reference/
├── script/
├── css/
├── index.html
└── dashboard.html
```

Directory purposes:

| Path | Purpose |
|---|---|
| `Assets/` | Stores invitation images, icons, media, fonts, and other project assets |
| `Reference/` | Stores screenshots or pictures of the reference page manually uploaded by the user |
| `script/` | Stores JavaScript files, including RSVP form behavior and Supabase integration |
| `css/` | Stores stylesheets for the invitation page |
| `index.html` | Public invitation and RSVP page sent to guests |
| `dashboard.html` | Private RSVP management page sent to the client |

Keep project-specific files within their client directory. Do not share assets or reference images between client projects unless the user explicitly requests it.

When the user supplies reference images:

1. Inspect the files in `Reference/`.
2. Use them to understand the requested visual direction and layout.
3. Build the page using original project code and the assets authorized for that project.
4. Do not use the reference image itself as a substitute for a functional web page.

## Client Deliverables

Every project provides two working pages.

### Invitation and RSVP Page

The public `index.html` page should:

- Present the invitation design and event information
- Display a countdown based on the event date, time, and timezone
- Display the enabled RSVP fields
- Validate required and enabled fields
- Submit responses to the project's Supabase data
- Show clear success, validation, capacity, and connection messages
- Ask for final confirmation and warn that the RSVP cannot be edited after submission
- Hide the RSVP form after a successful submission on that browser
- Replace the entire form/introduction area with one centered thank-you card after successful submission
- Work well on mobile and desktop

### RSVP Dashboard

The private `dashboard.html` page should:

- Use the default local script-based username and password screen
- Read project-scoped RSVP data from Supabase using the publishable browser key
- Allow authorized users to set and save total seats
- Allow authorized users to set and save family-reserved seats
- Show total seats, family-reserved seats, publicly available seats, submitted seats, and remaining seats
- Show the number of RSVP submissions
- List guest names and all optional fields enabled for the project
- Show each submission's date and time
- Show a compact milestone section, including messages such as `43 seats before full`
- Show a full-width capacity progress bar below the dashboard statistic cards, with occupied RSVP seats, public RSVP capacity, percentage used, and a colored progress fill
- Handle loading, empty, and error states
- Work well on mobile and desktop

### Default Dashboard Credentials

For Birthday projects, generate the temporary client credentials using:

```text
username = lowercase client name
temporary password = lowercase client name + birthdate in MMDDYY
```

Example:

```text
Samantabi + August 31, 2016
Username: samantabi
Temporary password: samantabi083116
```

The login form displays `Username` and `Password`. Store the generated credentials only in the individual project's dashboard JavaScript.

For the default dashboard login:

- Do not store credentials in Supabase or any database table.
- Do not use Supabase Authentication.
- Never store the username or password in browser storage.
- Store only a project-scoped unlocked flag in `localStorage` after successful login.
- Do not place credentials directly in the HTML.
- Keep the login script separate from all Supabase/database scripts. It contains only the generated username, password, and UI unlock/lock behavior.
- Keep the dashboard unlocked across refreshes until the client clicks the lock/sign-out control or clears browser data.
- Prevent normal form submission so credentials are never appended to the URL.

This is client-side access control only. It is not equivalent to secure server-side authentication because browser source code and network requests can be inspected. Never embed a Supabase service-role key or database credentials. If stronger privacy is required later, replace the local login with Supabase Auth or a protected server endpoint.

Confirm whether the client also needs:

- Search and filtering
- RSVP editing or deletion
- Manual RSVP entry
- Attendance or confirmation status
- CSV export
- Sorting

RSVP records contain personal information. The default local-script dashboard is lightweight protection only. Never put the Supabase service-role key in `dashboard.html` or any browser JavaScript.

## RSVP Form

The guest name is always required.

| Field | Default | Data type |
|---|---|---|
| Name | Required | Text |
| Email | Ask user | Email |
| Phone number | Ask user | Text |
| People attending with guest | Ask user | Non-negative integer |

The party-size value should have a clearly documented meaning. The recommended interpretation is:

```text
total party size = guest + people attending with guest
```

For example, when a guest enters `2` people attending with them, the RSVP consumes `3` seats.

## Supabase Data Model

All invitations share one Supabase project and exactly two SQL tables. Each row is separated by the client project ID, which matches the client directory name, for example `Testsam_071626`.

### Project Capacity

Shared table: `projects`

| Column | Suggested type | Purpose |
|---|---|---|
| `project_id` | Text | Primary key; matches `ClientName_MMDDYY` |
| `total_seats` | Integer | Manually configured capacity |
| `reserved_family_seats` | Integer | Seats unavailable to public RSVPs because they are reserved for family |
| `created_at` | Timestamptz | Creation time |
| `updated_at` | Timestamptz | Last update time |

The total and family-reserved seat counts are managed from the protected dashboard and must not be editable through the public RSVP form. Family-reserved seats cannot be negative or greater than total seats.

### RSVP Submissions

Suggested table: `rsvp_submissions`

| Column | Suggested type | Purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `project_id` | Text | Foreign key to the projects/capacity table |
| `name` | Text | Required guest name |
| `email` | Text, nullable | Optional email |
| `phone` | Text, nullable | Optional phone number |
| `additional_guests` | Integer, nullable | People attending with the guest |
| `total_party_size` | Integer | Total seats used by this RSVP |
| `created_at` | Timestamptz | Submission time |

Only fields enabled for the project need to appear on the public form. Nullable database columns allow the common schema to support different forms.

Every insert, capacity calculation, and dashboard query must include the correct `project_id`. A dashboard must never retrieve another client's RSVP records.

Dashboard tables must explicitly filter by the current project's `project_id` and show the guest name, enabled contact fields, additional guests, total party size, status, and submission time.

## Capacity Rules

Remaining seats are calculated as:

```text
public RSVP capacity = total seats - family-reserved seats
remaining seats = public RSVP capacity - sum of submitted total party sizes
```

Before implementing capacity enforcement, confirm whether the invitation should:

- Reject an RSVP that exceeds availability
- Show a warning and ask the guest to change the party size
- Accept the RSVP and flag it for manual review

Capacity enforcement must occur securely in the database or a trusted server-side function to prevent simultaneous submissions from overbooking the invitation.

## Security

- Enable Supabase Row Level Security.
- Allow public users to submit only the permitted RSVP fields.
- Limit browser reads to the specific `project_id` used by the dashboard. Note that this is not strong isolation without database authentication.
- Do not allow public users to change total seat capacity.
- Keep service-role credentials on the server only.
- Store the shared Supabase configuration in the repository root environment file and never commit real secrets.

## Minimum Completion Checklist

- [ ] Main invitation page created
- [ ] Event countdown created and tested
- [ ] Private RSVP dashboard created
- [ ] Dashboard local username/password screen created
- [ ] Login form confirmed not to expose credentials in the URL
- [ ] `Assets/` directory created
- [ ] `Reference/` directory created
- [ ] `script/` directory created
- [ ] `css/` directory created
- [ ] User-provided reference images inspected
- [ ] Event date, venue, time, and timezone confirmed
- [ ] Branding colors confirmed
- [ ] Celebrant or couple assets received
- [ ] Optional form fields confirmed with the user
- [ ] RSVP form created
- [ ] Required name validation added
- [ ] Capacity value configured
- [ ] Family-reserved seats configured
- [ ] Capacity behavior confirmed
- [ ] Supabase tables or migrations created
- [ ] Exact client project row exists in Supabase with the intended total and family-reserved seat values
- [ ] Row Level Security policies created
- [ ] Form submissions tested
- [ ] Confirmation warning tested
- [ ] Completed RSVP state persists on refresh
- [ ] Form and RSVP introduction are fully hidden after submission
- [ ] Thank-you card is centered
- [ ] Seat calculations tested
- [ ] Dashboard totals tested
- [ ] Dashboard milestone indicators tested
- [ ] Dashboard RSVP list tested
- [ ] Mobile layout tested

## Finishing and Publishing

Do not commit or push routine work while a client project is still being developed unless the user explicitly requests it.

The words `finish` or `finished`, when used to indicate that the project is complete, authorize the final workflow:

- Run the relevant completion checks
- Ensure secrets and private configuration are excluded
- Commit the completed project
- Push to the tracked Git branch
- Deploy or verify Vercel when configured
- Return the final invitation and dashboard links

An explicit request to commit, push, or deploy also authorizes those requested actions before the project is declared finished.
