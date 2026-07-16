# EpicInvite New Project Scaffold

This document defines what must be created inside every new Birthday or Wedding client project.

## Creation Workflow

Before creating the project, collect:

1. Project category: Birthday or Wedding
2. Client name
3. Event date
4. Event venue
5. Event time and timezone
6. Celebrant or couple pictures for `Assets/`
7. Branding colors
8. Website, screenshot, or image references for `Reference/`
9. RSVP fields to include:
   - Email
   - Phone number
   - Number of people attending with the guest
10. Total seat capacity, if it is already known
11. Family-reserved seats, if already known
12. What should happen when an RSVP exceeds the remaining seat capacity

Do not ask again for details the user has already supplied.

The client directory follows this format:

```text
Category/ClientName_MMDDYY/
```

Example:

```text
Wedding/Michael_071625/
```

## Web Application

Initialize a deployable web application directly inside the client directory. Its exact structure depends on the selected framework, but it must provide:

- A main invitation page
- A private RSVP dashboard
- An editable RSVP section
- Client-side form validation
- A connection to the shared repository-wide Supabase project
- Clear success and error feedback after submission
- Responsive behavior for phones and desktop browsers

If a plain static implementation is selected, use `index.html`. If a framework is selected, use its standard entry page instead.

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
- Work well on mobile and desktop

### RSVP Dashboard

The private `dashboard.html` page should:

- Read RSVP data from Supabase through an authenticated session or secure server-side endpoint
- Allow authorized users to set and save total seats
- Allow authorized users to set and save family-reserved seats
- Show total seats, family-reserved seats, publicly available seats, submitted seats, and remaining seats
- Show the number of RSVP submissions
- List guest names and all optional fields enabled for the project
- Show each submission's date and time
- Show a compact milestone section, including messages such as `43 seats before full`
- Handle loading, empty, and error states
- Work well on mobile and desktop

Confirm whether the client also needs:

- Search and filtering
- RSVP editing or deletion
- Manual RSVP entry
- Attendance or confirmation status
- CSV export
- Sorting

RSVP records contain personal information. Do not make the dashboard or its database-reading policy publicly accessible. Never put the Supabase service-role key in `dashboard.html` or any browser JavaScript.

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
- Do not allow public users to list all RSVP submissions.
- Do not allow public users to change total seat capacity.
- Keep service-role credentials on the server only.
- Store the shared Supabase configuration in the repository root environment file and never commit real secrets.

## Minimum Completion Checklist

- [ ] Main invitation page created
- [ ] Event countdown created and tested
- [ ] Private RSVP dashboard created
- [ ] Dashboard access protected
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
- [ ] Row Level Security policies created
- [ ] Form submissions tested
- [ ] Seat calculations tested
- [ ] Dashboard totals tested
- [ ] Dashboard milestone indicators tested
- [ ] Dashboard RSVP list tested
- [ ] Mobile layout tested
