# IMPLEMENTATION PLAN: Demo Mode (In-Memory Mocking)

> Reference source of truth: `PLAN_IMPLEMENTATION.md`

## 1. Acknowledgment

This plan is acknowledged. The objective is to convert this Next.js application into a fully
functional **Demo Mode** where every database operation is replaced with in-memory mock data
and handlers, while preserving all Prisma schemas, models, and TypeScript types untouched.

### Non-Negotiables (Ground Rules)

- **DO NOT** remove, delete, or refactor any Prisma models, schemas, or TS types.
- **DO NOT** execute read/write queries against a real database.
- **DO NOT** refactor the entire API codebase at once — one subfolder per step.
- Keep every change small, isolated, and git-traceable (one folder per commit).
- No emojis, no unnecessary comments in code.

## 2. Project Inventory (Facts)

- Framework: Next.js App Router (`src/app/api/.../route.ts`), TypeScript.
- API surface: **48 top-level API subfolders**, **332 `route.ts` files**.
- Prisma client: `src/app/libs/prisma.ts` (single shared `PrismaClient`).
- Prisma usage inside API routes: **~1,428 references**.
- Auth stack:
  - `src/auth.ts` — NextAuth config + JWT callbacks (queries `prisma.users`).
  - `src/auth.config.ts` — Credentials provider → `getUserEmailAndPassword()` in
    `src/app/libs/data.ts` (queries `prisma.users`).
  - `src/middleware.ts` — route protection (public vs protected paths).
  - `src/app/libs/auth-helpers.ts` — `checkPermissions()` used across API routes.
- Helpers also hitting the DB (used by API routes): `src/app/libs/data.ts`,
  `src/app/libs/actions.ts`, `src/app/libs/fetching.ts`, and services under
  `src/app/libs/services/`.

## 3. Architecture Strategy

### 3.1 Shared In-Memory Data Store (New Module)

Create a single module that simulates the database in memory for a session:

```
src/app/libs/mock-db/
  index.ts            # exported in-memory store + CRUD helpers
  data/               # hardcoded mock seed data (one file per domain)
    users.ts
    clients.ts
    leads.ts
    appointments.ts
    vehicles.ts
    settings.ts
    reports.ts
    ...
```

Rules for the store:

- Plain arrays/objects mirroring the shapes returned by the existing Prisma queries
  (the shapes the UI already expects).
- All mutation helpers (`create`, `update`, `delete`) operate only on these in-memory
  arrays (`push`, `filter`, `map`, `splice`).
- Data resets when the server process restarts (intended for demo).
- Export a typed `mockDb` facade so route handlers call one clean API:
  e.g. `mockDb.clients.findMany()`, `mockDb.clients.update({ id, data })`.

### 3.2 Hardcoded Demo Auth

Replace DB-backed auth paths so any demo user can log in seamlessly:

- Hardcode a fixed demo user (email + password) in `src/auth.config.ts`'s
  `authorize()` (validate against constants, not `prisma`).
- Replace the `prisma.users.findUnique` lookups in `src/auth.ts` JWT callbacks with
  mock-user lookups from the in-memory store.
- `src/app/libs/data.ts`'s `getUserEmailAndPassword()` returns the mock user object
  (shaped like the Prisma result the rest of the app expects).
- `checkPermissions()` in `src/app/libs/auth-helpers.ts` keeps working unchanged
  because the mock session token will carry the same `user_has` / permission shape
  (demo user granted full permissions incl. permission `1`).
- `src/middleware.ts` needs no changes (it only checks `auth?.user` presence).

### 3.3 Route Handler Pattern (Per Folder Step)

For every `route.ts` inside the assigned folder:

1. Remove/neutralize the `import prisma from '@/app/libs/prisma'` for that route's logic.
2. Replace each `prisma.<model>.<method>(...)` call with the equivalent
   `mockDb.<model>.<method>(...)` call (same argument shape as close as possible).
3. If a route's result depends on the session user (id, role), derive it from
   `auth()` / `checkPermissions()` as today — the demo session will resolve correctly.
4. Keep `NextResponse.json(...)` responses, HTTP status codes, `revalidatePath`,
   Twilio/webhook call simulation, and standard response formats **identical**.
5. Never call `prisma.$disconnect()` or any real DB query.
6. Run `npm run typecheck` before considering the folder complete.

### 3.4 Realistic API Simulation

- Simulate network behavior where cheap and unobtrusive (optional small latency helper).
- Return proper HTTP status codes (`200`, `201`, `400`, `403`, `404`, `500`) to match
  current behavior.
- Twilio-dependent endpoints (`twiml`, `callStatus`, `conferenceTransfer`,
  `callTransfer`, `twilioDeviceToken`, `waitConferenceUrl`, etc.) return realistic
  canned TwiML/JSON so the phone UI still renders.
- External integrations (VIN decode, image upload, email/SMS) return realistic mock
  payloads instead of calling real providers.

## 4. Complete List of API Subfolders (48 total)

Execution unit = one subfolder. Files per folder vary from 1 to 60+ routes.

| # | Subfolder | Routes (approx) | Notes |
|---|-----------|-----------------|-------|
| 1 | `adminDashboard` | ~120 | Largest; includes `clients`, `tasks`, `creditApp`, `reports`-like subroutes |
| 2 | `reports` | ~30 | Heavy aggregation/analytics queries |
| 3 | `inventory` | ~25 | Vehicle CRUD + stock |
| 4 | `settings` | ~20 | Voice/emails, templates, reasons, etc. |
| 5 | `bulkActions` | 4 | status, reassign, leadTemperature, consentSms |
| 6 | `message` | ~6 | Messaging |
| 7 | `consentTerms` | 4 | statements + checks |
| 8 | `auth` | 3 | nextauth, forgot-password, (session) |
| 9 | `deal` | 2 | |
| 10 | `creditAppCode` | 3 | |
| 11 | `creditAppNav` | 1 | |
| 12 | `customerData` | 1 | |
| 13 | `customerDetail` | 1 | |
| 14 | `customerSelect` | 1 | |
| 15 | `dashboardSearch` | 1 | |
| 16 | `appointmentSmsTemplate` | 2 | |
| 17 | `banks` | 2 | |
| 18 | `consentForm` | 1 | |
| 19 | `conversation` | 1 | |
| 20 | `callAnsweredBy` | 1 | |
| 21 | `callStatus` | 2 | Twilio |
| 22 | `callTransfer` | 1 | Twilio |
| 23 | `conferenceTransfer` | 1 | Twilio |
| 24 | `defaultPhoneNumber` | 1 | |
| 25 | `deliveryStatus` | 1 | |
| 26 | `disableSelects` | 1 | |
| 27 | `email` | 1 | |
| 28 | `endVisitCustomerInfoEdited` | 1 | |
| 29 | `eventsTypes` | 1 | |
| 30 | `fundedList` | 1 | |
| 31 | `incident` | 1 | |
| 32 | `incomingCallerIdentity` | 1 | |
| 33 | `lead` | 1 | |
| 34 | `letterhead` | 1 | |
| 35 | `lostReasons` | 1 | |
| 36 | `permissions` | 1 | |
| 37 | `public` | 1 | Public/unauthenticated |
| 38 | `rescheduleSms` | 2 | |
| 39 | `systemAccesses` | 1 | |
| 40 | `taskDueTimeLimit` | 1 | |
| 41 | `transferNoAnsweredConference` | 1 | Twilio |
| 42 | `twilioDeviceToken` | 1 | Twilio |
| 43 | `twiml` | 1 | Twilio |
| 44 | `user` | 1 | userImage |
| 45 | `userPicker` | 1 | |
| 46 | `vehiclePicker` | 1 | |
| 47 | `vinDecode` | 1 | External API mock |
| 48 | `waitConferenceUrl` | 1 | Twilio |

## 5. Execution Workflow (Step-by-Step)

**Ordering strategy:** boot critical paths first so the app runs end-to-end early, then
expand. Suggested phase order (adjustable on request):

### Phase 0 — Foundation (no route changes)
- Create `src/app/libs/mock-db/` store + seed data covering: users, permissions/roles,
  clients, leads, appointments, vehicles, settings.
- Implement hardcoded demo auth (3.2) so login works.
- Verify: login succeeds, dashboard renders, `npm run typecheck` passes.

### Phase 1 — Lightweight folders (1 route each)
Tackle a batch of simple, low-risk folders to establish the pattern:
`taskDueTimeLimit`, `systemAccesses`, `conversation`, `customerSelect`,
`dashboardSearch`, `customerData`, `deal`, `eventsTypes`, `incident`, `letterhead`,
`lostReasons`, `disableSelects`, `fundedList`, `permissions`, `defaultPhoneNumber`,
`deliveryStatus`, `email`, `endVisitCustomerInfoEdited`, `incomingCallerIdentity`,
`lead`, `public`, `user`, `userPicker`, `vehiclePicker`, `vinDecode`.

### Phase 2 — Twilio / call flow folders
`twiml`, `callStatus`, `callTransfer`, `conferenceTransfer`, `twilioDeviceToken`,
`waitConferenceUrl`, `transferNoAnsweredConference`, `callAnsweredBy`.

### Phase 3 — Medium folders
`bulkActions`, `consentTerms`, `creditAppCode`, `creditAppNav`, `customerDetail`,
`message`, `appointmentSmsTemplate`, `banks`, `consentForm`, `rescheduleSms`,
`auth`.

### Phase 4 — Heavy folders (one at a time)
`settings`, `inventory`, `reports`, `adminDashboard` (split `adminDashboard` into
its own sub-steps: `clients`, `tasks`, `creditApp`, `appointments`, `users`,
`business`, `dashboard`, remaining).

### Per-Folder Checklist
1. Confirm folder assignment with the user.
2. Read all `route.ts` files in the folder.
3. Replace DB logic with `mockDb` calls (per section 3.3).
4. Run `npm run typecheck` (and `npm run lint` if applicable).
5. Manually smoke-test the affected UI screens in `npm run dev` if possible.
6. Report completion; wait for confirmation before the next folder.

## 6. Verification Strategy

- `npm run typecheck` — must pass after every folder.
- `npm run build` — run after Phase 0 and after the final phase.
- Runtime: `npm run dev`, log in with the demo credentials, exercise each mocked
  screen (list → detail → create → update → delete) to confirm in-memory state
  changes reflect in the UI during the session.
- Confirm NO `prisma.` queries remain in the transformed folders:
  `rg "prisma\." src/app/api --glob "**/route.ts"` should only match commented-out
  lines / untouched folders.

## 7. Open Items / Decisions Needed

- [ ] Confirm the demo credentials (email/password) to hardcode (default suggestion:
      `demo@flowsups.com` / `demo1234`).
- [ ] Confirm phase order above, or pick a starting folder directly.
- [ ] Confirm whether `public/` folder (public assets/routes) needs mocking or stays as-is.
- [ ] Confirm Twilio endpoints should return canned success payloads (recommended)
      rather than real network calls.

---

## 8. Deep Per-File Dissection & Implementation Guide

> This section is the per-file blueprint for the transformation. Every `route.ts`
> under `src/app/api` is listed, grouped by folder, with: HTTP verbs, the Prisma
> models + operations currently executed, and the unique in-memory implementation
> approach for that file.
>
> Legend:
> - **V** = verbs exposed by the route.
> - **DB** = `prisma.<model>` models touched and operations used
>   (`fM` findMany, `fU` findUnique, `fF` findFirst, `cr` create, `up` update,
>   `upM` updateMany, `del` delete, `delM` deleteMany, `crM` createMany,
>   `agg` aggregate, `grp` groupBy, `count`, `upsert`).
> - **Note** = the file-specific mock implementation. Files marked *(no DB)* never
>   touch Prisma — they call external APIs or helpers and only need canned responses.
>
> Shared approach for every file: swap `prisma.<model>.<op>` → `mockDb.<model>.<op>`
> keeping the same argument shape; keep every `NextResponse.json(...)` and status code
> byte-for-byte; drop `prisma.$disconnect()` calls.

### 8.1 `adminDashboard` (largest; ~120 routes — split into sub-groups A–K)

#### 8.1.A Clients & Customer Pipeline

- **`adminDashboard/clients/route.ts`** — V: GET,POST — DB: `clients`(fM,cr), `leads`(cr),
  `lead_sources`(fF,cr), `users_has_customers`(cr), `client_address`(cr), `events`(cr),
  `notifications`(cr)
  — Note: GET is the master customer list (pagination + `select` projection). POST is full
  customer creation (creates client + lead + address + assignment + notification). Mock:
  seed `mockDb.clients` with ~30 realistic customers; POST pushes into `clients`/`leads`
  arrays and derives the new id via `nextId()`; return the created customer so the list
  refreshes in-session.
- **`adminDashboard/clients/[id]/route.ts`** — V: GET — DB: `clients`(fM)
  — Note: single-client detail (heavily nested `include`). Mock: `mockDb.clients.findUnique`
  returning the full nested shape from seed data; 404 if id not found.
- **`adminDashboard/clients/by-filters/route.ts`** — V: POST — DB: `clients`(fM)
  — Note: uses `buildDatePrismaFilter` + `convertToPrismaFilters` to build a where clause.
  Mock: implement a tiny in-memory filter engine (date-range + selected filters) or return
  a pre-filtered subset; exact match semantics are not critical for demo.
- **`adminDashboard/clientsNotes/route.ts`** — V: GET,POST — DB: `notes`(fM,cr)
  — Note: global notes list + create (also `createEvent`, `createNotification`,
  `createGeneralLead` helpers). Mock: seed `mockDb.notes`; POST pushes a note and returns it.
- **`adminDashboard/clientsNotes/[id]/route.ts`** — V: GET — DB: `notes`(fM)
  — Note: notes for one client; filter `mockDb.notes` by client id.
- **`adminDashboard/singleClient/[client_id]/route.ts`** — V: GET,PUT,DELETE — DB:
  `clients`(fU,up), `leads`(fF,up,cr), `client_has_lead`(cr,crM), `notes`(cr),
  `users_has_customers`(cr), `lead_sources`(fU)
  — Note: the big "client workspace" endpoint (edit customer + create lead + assign).
  Mock: GET returns joined seed object; PUT mutates `mockDb.clients`/`mockDb.leads`;
  DELETE soft-deletes (`deleted_at`) in-memory.
- **`adminDashboard/singleClient/[client_id]/taskList/route.ts`** — V: GET — DB: `tasks`(fM)
  — Note: filter `mockDb.tasks` by client/lead id, ordered by due date.
- **`adminDashboard/clientStatuses/route.ts`** — V: GET — DB: `client_status`(fM)
  — Note: reference list → static seed array.
- **`adminDashboard/clientTypes/route.ts`** — V: GET — DB: `client_types`(fM) — static seed.
- **`adminDashboard/clientDetailLeads/route.ts`** — V: GET — DB: `client_detail_leads`(fM)
  — static seed (ordered by id asc).
- **`adminDashboard/setCustomerStatus/[id]/route.ts`** — V: PUT — DB: `clients`(up),
  `leads`(fF,up), `client_has_lead`(cr), `client_status`(fU), `notes`(cr),
  `daily_visit_history`(cr), `vehicle_delivery`(cr), `vehicles`(fU,up)
  — Note: full status-change workflow. Mock: mutate `clients.status_id`, create `client_has_lead`
  + `notes` rows in-memory, toggle vehicle delivery flags; keep the same response shape.
- **`adminDashboard/setCustomerStatus/markAsLost/[id]/route.ts`** — V: PUT — DB:
  `clients`(fU,up), `leads`(fF,up), `client_has_lead`(cr), `notes`(cr), `vehicles`(fU)
  — same approach as above, scoped to "lost".
- **`adminDashboard/clientVehicle/route.ts`** — V: POST — DB: `client_vehicle_tradein`(cr,ups),
  `client_vehicle_wishlist`(cr), `vehicle_*`(fU,ups)
  — Note: adds trade-in/wishlist vehicle with nested lookup/upsert of make/model/etc.
  Mock: upsert vehicle lookup rows into `mockDb.vehicle_*` arrays; push trade-in record.
- **`adminDashboard/clientVehicle/[id]/route.ts`** — V: PUT — DB:
  `client_vehicle_tradein`(fF,up,cr,ups), `vehicle_identification_numbers`(ups),
  `vehicle_make`(ups), `vehicle_manufacture_years`(ups), `vehicle_mileages`(ups),
  `vehicle_models`(ups), `vehicle_tradein_comments`(cr), `vehicle_trims`(ups)
  — Note: update trade-in + vehicle lookup tables. Mock: mutate the trade-in object and
  push/refresh the nested lookup rows.
- **`adminDashboard/deposit/[id]/route.ts`** — V: GET,POST,PUT — DB: `deposits`(cr,fU,up),
  `clients`(fU,up), `leads`(fF,up), `client_has_lead`(cr), `notes`(cr), `vehicles`(fU,up)
  — Note: deposit lifecycle per customer/vehicle. Mock: seed deposits; create/update in
  `mockDb.deposits`; reflect on the linked client/lead.
- **`adminDashboard/depositMethods/route.ts`** — V: GET — DB: `deposit_methods`(fM) — static seed.
- **`adminDashboard/fundedList`** → see 8.23.

#### 8.1.B Leads & Lead Actions

- **`adminDashboard/lead/addTask/[id]/route.ts`** — V: POST — DB: `tasks`(cr), `notes`(cr),
  `clients`(fU,up), `leads`(fF,up), `client_has_lead`(cr)
  — Note: creates a follow-up task + note. Mock: push task + note into `mockDb.tasks`/`notes`;
  link ids; return created task.
- **`adminDashboard/lead/badPhoneNumber/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr)
  — Note: flips a lead flag + records note. Mock: set `bad_phone` flag on the
  `client_has_lead` object; push note.
- **`adminDashboard/lead/dealInProgress/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr) — same pattern (flag + note).
- **`adminDashboard/lead/leftMessage/[id]/route.ts`** — V: POST — DB: `client_calls`(cr),
  `client_has_lead`(cr), `tasks`(cr), `task_Notes`(cr), `notes`(cr)
  — Note: left-message outcome; also creates follow-up task. Mock: push a `client_calls` row
  (status "left message") + task; update lead.
- **`adminDashboard/lead/manualEmailSent/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr) — flag + note pattern.
- **`adminDashboard/lead/manualSmsSent/[id]/route.ts`** — V: POST — DB: `client_sms`(cr),
  `client_has_lead`(cr), `tasks`(cr), `task_Notes`(cr), `notes`(cr)
  — Note: records an outbound SMS + task. Mock: push into `mockDb.client_sms` (body from
  template), update lead counters.
- **`adminDashboard/lead/markAsLost/[id]/route.ts`** — V: POST — DB: `leads`(fF,up),
  `clients`(fF,up), `client_has_lead`(cr), `notes`(cr)
  — Note: lost workflow (sets status + reason). Mock: mutate lead status + store lost reason.
- **`adminDashboard/lead/noAnswer/[id]/route.ts`** — V: POST — DB: `client_calls`(cr),
  `client_has_lead`(cr), `tasks`(cr), `task_Notes`(cr), `notes`(cr) — same as leftMessage.
- **`adminDashboard/lead/note/[id]/route.ts`** — V: POST — DB: `notes`(cr)
  — Note: plain note create; push + return.
- **`adminDashboard/lead/prospectRequestedDnc/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr) — DNC flag + note.
- **`adminDashboard/lead/prospectTest/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr) — flag + note.
- **`adminDashboard/lead/prospectVisitedDealership/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr) — flag + note.
- **`adminDashboard/lead/receivedEmailFromProspect/[id]/route.ts`** — V: POST — DB:
  `client_has_lead`(cr), `notes`(cr) — flag + note.
- **`adminDashboard/lead/receiveSmsFromProspect/[id]/route.ts`** — V: POST — DB:
  `client_sms`(cr), `client_has_lead`(cr), `tasks`(cr), `task_Notes`(cr), `notes`(cr)
  — inbound SMS + task pattern.
- **`adminDashboard/lead/schedule/[id]/route.ts`** — V: POST — DB: `appointments`(cr),
  `client_has_lead`(cr), `clients`(fU,up), `leads`(fF,up), `notes`(cr),
  `automatic_sms`(fF), `appointmentSms`(cr)
  — Note: scheduling an appointment (creates appointment + confirmation SMS). Mock: push
  appointment; generate a canned confirmation SMS body; update lead/appointment ids.
- **`adminDashboard/lead/setStatus/[id]/route.ts`** — V: POST — DB: `leads`(fF,up),
  `clients`(fF,up), `client_has_lead`(cr), `notes`(cr) — status change + note.
- **`adminDashboard/lead/sold/[id]/route.ts`** — V: POST — DB: `leads`(fF,up,upM),
  `clients`(up), `vehicles`(upM,up), `client_has_lead`(cr), `notes`(cr)
  — Note: mark sold (sets vehicle sold, lead status). Mock: update vehicle `is_sold`,
  lead status, add note.
- **`adminDashboard/lead/spokeProspect/[id]/route.ts`** — V: POST — DB: `client_calls`(cr),
  `client_has_lead`(cr), `leads`(fF,up), `tasks`(cr), `task_Notes`(cr), `notes`(cr)
  — spoke + task + call log pattern.
- **`adminDashboard/leadTemperature/[id]/route.ts`** — V: PUT — DB: `clients`(fF,up),
  `leads`(fF,up) — update temperature on client + lead.
- **`adminDashboard/leadTemperature/route.ts`** — V: GET — DB: `lead_temperature`(fM) — static seed.
- **`adminDashboard/leadSources/route.ts`** — V: GET — DB: `lead_sources`(fM) — static seed.
- **`adminDashboard/leadSources/[id]/route.ts`** — V: PUT,DELETE — DB: `lead_sources`(up,del)
  — mutate/remove seed array entry.
- **`adminDashboard/leadTypes/route.ts`** — V: GET — DB: `lead_types`(fM) — static seed.
- **`adminDashboard/lostReasons`** → see 8.25.

#### 8.1.C Credit Application

- **`adminDashboard/creditApp/[id]/route.ts`** — V: GET — DB: `credit_app`(fU), `credit_app_address`(fF),
  `customer_employment`(fM), `credit_app_reference`(fM)
  — Note: assembles the full credit app DTO (`getCustomerCreditAppData`-style mapping).
  Mock: seed one or two complete `credit_app` records with nested address/employment/
  references; return the assembled shape directly.
- **`adminDashboard/creditApp/start/[id]/route.ts`** — V: GET,PUT — DB: `credit_app`(fU,ups),
  `credit_app_navigation`(ups)
  — Note: first-step SSN/DOB + navigation step. Mock: upsert into `mockDb.credit_app` +
  `mockDb.credit_app_navigation` by client id.
- **`adminDashboard/creditApp/address/[id]/route.ts`** — V: GET,POST — DB:
  `credit_app_address`(fU,ups), `credit_app_address_prev`(delM,fM), `credit_app_navigation`(fU,ups)
  — Note: address step, replaces previous-address rows. Mock: upsert address; reset
  `prev_address` array with the posted rows.
- **`adminDashboard/creditApp/employmentStatus/[id]/route.ts`** — V: GET,POST — DB:
  `customer_employment`(fM,ups,delM), `credit_app_navigation`(fU,ups)
  — Note: employment step (first row = current, rest = previous). Mock: store rows array
  in-memory, replace on POST.
- **`adminDashboard/creditApp/references/[id]/route.ts`** — V: GET,POST — DB:
  `credit_app_reference`(fM,ups,delM), `credit_app_other_income`(fF,up,ups),
  `clients`(fU), `customer_employment`(fM)
  — Note: references + other income step. Mock: push reference rows, upsert other-income.
- **`adminDashboard/creditApp/finish/[id]/route.ts`** — V: POST — DB: `leads`(fF,up),
  `clients`(fF,up) — marks credit app completed. Mock: set `credit_app_completed` flags.
- **`adminDashboard/creditAddressMonth/route.ts`** — V: GET — DB: `credit_app_address_months`(fM) — static seed.
- **`adminDashboard/creditAddressType/route.ts`** — V: GET — DB: `credit_app_address_type`(fM) — static seed.
- **`adminDashboard/creditAppReferenceRelationship/route.ts`** — V: GET — DB:
  `credit_app_reference_relationship`(fM) — static seed.
- **`adminDashboard/employmentStatus/route.ts`** — V: GET — DB: `employment_statuses`(fM) — static seed.
- **`adminDashboard/occupation/route.ts`** — V: GET — DB: `customer_occupation`(fM) — static seed.
- **`adminDashboard/incomeType/route.ts`** — V: GET — DB: `customer_income_type`(fM) — static seed.
- **`adminDashboard/creditAppListStatus/route.ts`** — V: GET — DB: `credit_app_list_status`(fM) — static seed.
- **`adminDashboard/creditAppListStatus/[id]/route.ts`** — V: PUT — DB: `clients`(up)
  — Note: sets a customer's credit-app list status. Mock: mutate `clients` field.
- **`adminDashboard/reminderTime/route.ts`** — V: GET — DB: `reminderTime`(fM) — static seed.
- **`adminDashboard/clientIdState/route.ts`** — V: GET — DB: `client_id_state`(fM) — static seed.
- **`adminDashboard/clientIdType/route.ts`** — V: GET — DB: `client_id_type`(fM) — static seed.
- **`adminDashboard/gender/route.ts`** — V: GET — DB: `genders`(fM) — static seed.
- **`adminDashboard/states/route.ts`** — V: GET — DB: `states`(fM) — static seed (id/state/state_code).

#### 8.1.D Appointments & Scheduling

- **`adminDashboard/appointments/route.ts`** — V: GET,POST,DELETE — DB: `appointments`(fM,cr,del),
  `automatic_sms`(fF), `clients`(fU,up), `leads`(fF,up), `client_has_lead`(cr), `notes`(cr)
  — Note: master calendar (GET), schedule (POST), bulk delete. Mock: GET filters seed
  appointments by date range; POST pushes appointment + update lead; DELETE removes ids.
- **`adminDashboard/appointments/[id]/route.ts`** — V: GET,PUT,DELETE — DB: `appointments`(fU,up,del),
  `automatic_sms`(fF), `clients`(fU)
  — Note: appointment detail, reschedule/update, delete. Mock: mutate/remove
  `mockDb.appointments[id]`; return updated object.
- **`adminDashboard/appointments/[id]/note/route.ts`** — V: PUT — DB: `notes`(cr),
  `appointments`(fF,up), `client_has_lead`(fF)
  — Note: attach a note to an appointment. Mock: push note, link ids.
- **`adminDashboard/dailyAppointments/route.ts`** — V: GET — DB: `appointments`(fM)
  — Note: today's appointments; filter seed by date.
- **`adminDashboard/dailyAppointments/[id]/route.ts`** — V: PUT — DB: `appointments`(up)
  — Note: quick status change; mutate status field.
- **`adminDashboard/dailyActvityAppointments/route.ts`** — V: GET — DB: `appointments`(fM) — daily list.
- **`adminDashboard/dailyActvityAppointments/[id]/route.ts`** — V: GET,POST,PUT — DB:
  `appointments`(fF,fM,cr,up), `leads`(fF,up)
  — Note: daily activity CRUD. Mock: standard in-memory mutations.
- **`adminDashboard/confirmAppointmentSms/[id]/route.ts`** — V: POST — DB: `appointments`(fU,up),
  `clients`(fU,up), `automatic_sms`(fF)
  — Note: sends confirmation SMS and marks sent. Mock: build canned SMS body from the
  appointment; set `sms_sent` flag; return the updated appointment.
- **`adminDashboard/cancelDailyActivityAppointment/[id]/route.ts`** — V: PUT — DB:
  `appointments`(up), `tasks`(cr)
  — Note: cancel + create a task. Mock: set status "cancelled"; push task.
- **`adminDashboard/cancelDailyActivityAppointment/cancel/[id]/route.ts`** — V: PUT — DB:
  `appointments`(up), `tasks`(up) — cancel variant.
- **`adminDashboard/cancelDailyActivityAppointment/accept/[id]/route.ts`** — V: PUT — DB:
  `appointments`(up), `tasks`(up) — accept variant.
- **`adminDashboard/rescheduleDailyActivityAppointment/[id]/route.ts`** — V: PUT — DB:
  `appointments`(fF,cr,up), `tasks`(fF,cr,up)
  — Note: reschedule workflow (new time slot + task). Mock: mutate appointment time + task.
- **`adminDashboard/rescheduleDailyActivityAppointment/accept/[id]/route.ts`** — V: PUT — DB:
  `appointments`(fF,up), `clients`(fU,up), `automatic_sms`(fF), `tasks`(up)
  — Note: accept + send SMS. Mock: same as confirmAppointmentSms pattern.
- **`adminDashboard/rescheduleDailyActivityAppointment/change/[id]/route.ts`** — V: PUT — DB:
  `appointments`(up), `tasks`(up) — change timeslot variant.
- **`adminDashboard/appointments_status` reference** → `adminDashboard/statuses/route.ts` — V: GET — DB:
  `appointments_status`(fM) — static seed.
- **`adminDashboard/dayTime/route.ts`** — V: GET — DB: `day_times`(fM) — static seed.
- **`adminDashboard/dayweeks/route.ts`** — V: GET — DB: `user_schedule_dayweek`(fM) — static seed.
- **`adminDashboard/timeSpan/route.ts`** — V: GET — DB: `time_span`(fM) — static seed.

#### 8.1.E Tasks

- **`adminDashboard/tasks/route.ts`** — V: GET — DB: `tasks`(fM)
  — Note: master task list; filter seed by status/date/user.
- **`adminDashboard/tasks/[id]/route.ts`** — V: GET,PUT — DB: `tasks`(fU,up,fM),
  `leads`(fF), `users`(fU), `tasks`(crM,delM)
  — Note: task detail + update (incl. recurring regenerate). Mock: mutate task;
  if recurring, push next occurrence via crM.
- **`adminDashboard/tasks/cancel/[id]/route.ts`** — V: PUT — DB: `tasks`(up) — set cancelled.
- **`adminDashboard/tasks/complete/[id]/route.ts`** — V: PUT — DB: `tasks`(up) — set completed.
- **`adminDashboard/tasks/complete/route.ts`** — V: POST — DB: `tasks`(upM) — bulk complete.
- **`adminDashboard/tasks/followUp/[id]/route.ts`** — V: PUT — DB: `tasks`(fU,up,crM)
  — Note: mark follow-up + create next task. Mock: mutate + push next task.
- **`adminDashboard/tasks/taskList/[userId]/route.ts`** — V: GET,POST — DB: `tasks`(fM,cr),
  `users`(fU)
  — Note: per-user task board (GET) + manual create (POST). Mock: filter seed by user,
  push created task.
- **`adminDashboard/acceptAllTasks/route.ts`** — V: PUT — DB: `tasks`(upM) — bulk accept.
- **`adminDashboard/cancelAllTasks/route.ts`** — V: PUT — DB: `tasks`(upM) — bulk cancel.
- **`adminDashboard/missingTasks/[userId]/route.ts`** — V: GET — DB: `tasks`(fM), `users`(fU)
  — Note: overdue/incomplete for the user; compute from seed dates.
- **`adminDashboard/taskNote/route.ts`** — V: POST — DB: `task_Notes`(cr) — create note on task.
- **`adminDashboard/managerTask/route.ts`** — V: POST — DB: `tasks`(cr), `task_Notes`(cr),
  `client_has_lead`(cr), `notes`(cr)
  — Note: manager-created task w/ note. Mock: push task + note rows.

#### 8.1.F Users, Roles, Permissions & Team

- **`adminDashboard/users/route.ts`** — V: GET,POST — DB: `users`(fM,cr,fU,up)
  — Note: user management list + create (with hashed password). Mock: seed team users;
  POST pushes user with a mock bcrypt hash and default role.
- **`adminDashboard/users/[id]/route.ts`** — V: GET,PUT,DELETE — DB: `users`(fU,up),
  `users_has_roles`(cr,ups), `user_schedule`(cr,ups,upM), `pay_plan`(cr,up), `appointments`(fM)
  — Note: user detail/edit/delete + schedule + pay plan. Mock: mutate user + nested
  schedule/payplan arrays; delete = soft.
- **`adminDashboard/users/[id]/dailyPointsTarget/route.ts`** — V: PUT — DB: `users`(up)
  — set daily target.
- **`adminDashboard/userStatus/route.ts`** — V: GET — DB: `user_status`(fM) — static seed.
- **`adminDashboard/userStatus/[id]/route.ts`** — V: PUT,DELETE — DB: `users`(up,del)
  — activate/deactivate + delete. Mock: mutate `deleted_at` / status.
- **`adminDashboard/userSchedule/[id]/route.ts`** — V: GET — DB: `user_schedule`(fM)
  — filter by user id.
- **`adminDashboard/sellers/route.ts`** — V: GET — DB: `users`(fM)
  — Note: sellers by role (`Roles.SalesRep/Admin/Superuser`); filter seed users by role.
- **`adminDashboard/bdc/route.ts`** — V: GET — DB: `users`(fM) — filter by BDC role.
- **`adminDashboard/salesManager/route.ts`** — V: GET — DB: `users`(fM) — filter by SM role.
- **`adminDashboard/financeManager/route.ts`** — V: GET — DB: `users`(fM) — filter by FM role.
- **`adminDashboard/roles/route.ts`** — V: GET,POST — DB: `roles`(fM,cr),
  `roles_has_permissions`(cr)
  — Note: role catalog + create with permissions mapping. Mock: seed roles incl. id 1
  (Superuser); push new role + `roles_has_permissions` rows.
- **`adminDashboard/roles/[id]/route.ts`** — V: GET,PUT,DELETE — DB: `roles`(fU,up,del),
  `roles_has_permissions`(ups,del)
  — Note: role detail/edit/delete; re-map permissions array. Mock: mutate + replace
  permission rows.
- **`adminDashboard/roleStatus/[id]/route.ts`** — V: PUT — DB: `roles`(up) — enable/disable role.
- **`adminDashboard/permission/route.ts`** — V: GET — DB: `permissions`(fM) — static seed
  (perm id 1 = full access; matches `checkPermissions`).
- **`adminDashboard/permissions/[id]`** → see 8.26.
- **`adminDashboard/roundRobin/route.ts`** — V: GET — DB: `round_robin`(fF) — settings fetch.
- **`adminDashboard/roundRobin/[id]/route.ts`** — V: PUT — DB: `round_robin`(up) — settings update.
- **`adminDashboard/roundRobin/user/[id]/route.ts`** — V: PUT — DB: `users`(fM,up)
  — Note: toggles a user into/out of round-robin. Mock: mutate user flag.

#### 8.1.G Business & Dealership Settings

- **`adminDashboard/business/route.ts`** — V: GET,POST — DB: `business`(fF,cr)
  — Note: single dealership profile get-or-create. Mock: return seeded `mockDb.business[0]`;
  POST updates if exists.
- **`adminDashboard/business/[id]/route.ts`** — V: PUT — DB: `business`(up) — mutate profile.
- **`adminDashboard/website/route.ts`** — V: GET,POST — DB: `business_websites`(fM,cr) — list/create.
- **`adminDashboard/website/[id]/route.ts`** — V: DELETE — DB: `business_websites`(del) — remove.
- **`adminDashboard/primaryDealerWebsiteUrl/route.ts`** — V: GET,POST — DB:
  `business_primary_website_url`(fF,cr) — get/create primary URL.
- **`adminDashboard/primaryDealerWebsiteUrl/[id]/route.ts`** — V: PUT,DELETE — DB:
  `business_primary_website_url`(up,del).
- **`adminDashboard/vehicleDetailPageUrl/route.ts`** — V: GET,POST — DB:
  `business_vehicle_detail_page_url`(fM,cr).
- **`adminDashboard/vehicleDetailPageUrl/[id]/route.ts`** — V: DELETE — DB:
  `business_vehicle_detail_page_url`(del).
- **`adminDashboard/vehicleMileages/route.ts`** — V: GET — DB: `vehicle_mileages`(fM) — static seed.
- **`adminDashboard/vehicleOptions/route.ts`** — V: GET — DB: 13 `vehicle_*` reference tables (fM)
  — Note: bundles every vehicle dropdown. Mock: return a single aggregated object of the
  static seed arrays.
- **`adminDashboard/vehicleOptions/vehicles/route.ts`** — V: GET — DB: `vehicles`(fM) — vehicle list.
- **`adminDashboard/vehicleTypes/route.ts`** — V: GET — DB: `vehicle_types`(fM) — static seed.

#### 8.1.H Notifications

- **`adminDashboard/notificationsPreferences/route.ts`** — V: GET,POST — DB:
  `notifications_preferences`(fM,ups) — list + upsert prefs per user.
- **`adminDashboard/notificationsPreferences/[id]/route.ts`** — V: PUT — DB:
  `notifications_preferences`(upM) — bulk update user prefs.
- **`adminDashboard/notificationsCounts/[id]/route.ts`** — V: POST — DB:
  `notifications`(fM,grp), `notifications_preferences`(fM)
  — Note: grouped unread counts by category. Mock: compute counts from seed notifications
  filtering by user id + prefs.
- **`adminDashboard/notifications/[id]/route.ts`** — V: POST,PUT,DELETE — DB:
  `notifications`(fM,up,del), `notifications_preferences`(fM) — list/mark-read/delete.
- **`adminDashboard/totalNotifications/[id]/route.ts`** — V: POST — DB: `notifications`(count,fM),
  `notifications_preferences`(fM) — Note: total unread badge count; compute from seed.
- **`adminDashboard/markAllNotiAsread/[id]/route.ts`** — V: PUT — DB: `notifications`(upM)
  — set all read.

#### 8.1.I Dashboard KPIs & Activity

- **`adminDashboard/totalTodayAppointments/route.ts`** — V: GET — DB: `appointments`(count)
  — Note: count today's; filter seed by today's date, return number.
- **`adminDashboard/dailyTotals/[userId]/route.ts`** — V: GET — DB: `users`(fU),
  `appointments`(count,fM), `client_calls`(count,fM), `client_sms`(count,fM),
  `credit_app`(count,fM), `leads`(count,fM), `tasks`(count,fM)
  — Note: the KPI hub. Mock: count seed rows per entity filtered by user + date.
- **`adminDashboard/dailyCalls/[userId]/route.ts`** — V: GET — DB: `client_calls`(fM),
  `users`(fM) — calls for user.
- **`adminDashboard/dailyMessages/[userId]/route.ts`** — V: GET — DB: `client_sms`(fM) — SMS list.
- **`adminDashboard/dailyMadeAppointments/[userId]/route.ts`** — V: GET — DB: `appointments`(fM).
- **`adminDashboard/dailyMadeCreditApp/route.ts`** — V: GET — DB: `credit_app`(fM),
  `leads`(fM), `appointments`(fM) — today's credit apps.
- **`adminDashboard/dailySells/route.ts`** — V: GET — DB: `leads`(fM) — today's sales.
- **`adminDashboard/calls/[id]/route.ts`** — V: GET — DB: `client_calls`(fM), `users`(fM)
  — call log for client.
- **`adminDashboard/events/route.ts`** — V: GET — DB: `events`(fM) — activity feed (desc).
- **`adminDashboard/events/[id]/route.ts`** — V: GET — DB: `events`(fM) — events for entity.
- **`adminDashboard/eventsCategories/route.ts`** — V: GET — DB: `event_category`(fM) — static seed.
- **`adminDashboard/followupVisibility/route.ts`** — V: GET — DB: `followup_task_visibility`(fM) — static seed.

#### 8.1.J Files, Incidents, Visits & Vehicle Delivery

- **`adminDashboard/files/[id]/route.ts`** — V: GET,POST,DELETE — DB: `files`(fM,cr,del)
  — Note: file attachments (may use GCS upload helper). Mock: store file metadata rows
  in-memory; return placeholder URLs.
- **`adminDashboard/endVisit/[id]/route.ts`** — V: POST — DB: `appointments`(fF,up),
  `leads`(fF,up), `clients`(fU,up), `client_address`(up), `client_has_lead`(cr),
  `notes`(cr), `daily_visit_history`(cr), `vehicles`(fU,up), `vehicle_delivery`(cr,upM)
  — Note: the big "end visit" save-all (many tables). Mock: perform each mutation against
  the corresponding mockDb array; preserve the aggregate response shape.
- **`adminDashboard/incident`** → see 8.24.
- **`adminDashboard/cobuyerRelationship/route.ts`** — V: GET,POST,DELETE — DB:
  `leads`(fF,up), `client_has_cobuyer`(fM,cr,del), `cobuyer_client_relationship`(fM,del)
  — Note: manage co-buyer links. Mock: CRUD against `mockDb.client_has_cobuyer`.
- **`adminDashboard/cobuyerReferrerSingleClient/[id]/route.ts`** — V: GET,PUT,DELETE — DB:
  `clients`(fU,up) — Note: heavy joined payload (co-buyer + referrer info for one client).
  Mock: assemble from seed clients + related arrays.
- **`adminDashboard/referrer/route.ts`** — V: POST — DB: `leads`(fF,up),
  `clients_has_referrer`(ups)
  — Note: set/upsert referrer on a lead. Mock: upsert into `mockDb.clients_has_referrer`.
- **`adminDashboard/otherVehicle/route.ts`** — V: GET,POST,PUT — DB: `vehicles`(fU,cr,up),
  `vehicle_identification_numbers`(fU,cr), `vehicle_make`(fF,ups), `vehicle_models`(fF,ups),
  `vehicle_manufacture_years`(fF,ups)
  — Note: other-vehicle (second vehicle) add/edit. Mock: standard in-memory vehicle CRUD.
- **`adminDashboard/vehicleScheduled/route.ts`** — V: POST — DB: `clients`(fF,up),
  `leads`(fF,up), `client_has_lead`(cr), `notes`(cr), `vehicle_delivery`(cr)
  — Note: schedule vehicle delivery for a customer. Mock: push `vehicle_delivery` row,
  update client/lead delivery flag.
- **`adminDashboard/contactMethods/route.ts`** — V: GET — DB: `contact_methods`(fM) — static seed.
- **`adminDashboard/contactTime/route.ts`** — V: GET — DB: `contact_time`(fM) — static seed.
- **`adminDashboard/inquiryTypes/route.ts`** — V: GET — DB: `inquiry_types`(fM) — static seed.
- **`adminDashboard/languages/route.ts`** — V: GET — DB: `languages`(fM) — static seed.

#### 8.1.K Reports & Templates under adminDashboard

- **`adminDashboard/reports/customer-list/route.ts`** — V: GET,POST — DB: `customer_Report`(fM,cr,fF)
  — Note: saved customer report configurations. Mock: seed saved reports; POST pushes a new
  config (filters JSON).
- **`adminDashboard/reports/customer-list/[id]/route.ts`** — V: GET,PUT,DELETE — DB:
  `customer_Report`(fU,up,del) — CRUD on one saved report.
- **`adminDashboard/reports/customer-list/sendReportEmail/route.ts`** — V: POST — *(no DB)*
  — Note: sends report by email (uses email service). Mock: return `{ success: true }`.
- **`adminDashboard/reports/customer-list/setAsDefault/[id]/route.ts`** — V: POST — DB:
  `users`(fU,up) — set default report on user.
- **`adminDashboard/reports/customer-list/setAsFavorite/[id]/route.ts`** — V: POST — DB:
  `users`(up) — toggle favorite.
- **`adminDashboard/smsTemplate/route.ts`** — V: POST — DB: `sms_template`(cr),
  `sms_template_category`(fF)
  — Note: create SMS template. Mock: push template + resolve category.
- **`adminDashboard/smsTemplate/[id]/route.ts`** — V: PUT — DB: `sms_template`(up,cr),
  `sms_template_category`(fF) — update template.
- **`adminDashboard/taskNote`** covered in 8.1.E.

### 8.2 `appointmentSmsTemplate`

- **`appointmentSmsTemplate/route.ts`** — V: GET — DB: `appointmentSms`(fF)
  — Note: single appointment-SMS template. Mock: return seed template.
- **`appointmentSmsTemplate/[id]/route.ts`** — V: PUT — DB: `appointmentSms`(up) — update template.

### 8.3 `auth`

- **`auth/[...nextauth]/route.ts`** — V: GET,POST — *(no DB — re-exports `handlers`)*
  — Note: no change needed beyond the `src/auth.ts` + `src/auth.config.ts` mock auth
  (Section 3.2). Keep as-is.
- **`auth/forgot-password/route.ts`** — V: POST — DB: `users`(fU)
  — Note: finds user by email and (in prod) emails a reset link. Mock: look up the mock
  user; if found return the success shape without sending email.

### 8.4 `banks`

- **`banks/route.ts`** — V: GET — DB: `banks`(fM) — static seed list.
- **`banks/[id]/route.ts`** — V: DELETE — DB: `banks`(del) — remove from seed.

### 8.5 `bulkActions`

- **`bulkActions/status/route.ts`** — V: POST — DB: `clients`(fM,upM), `leads`(upM)
  — Note: bulk status change over many ids. Mock: map over ids, set status on each
  `mockDb.clients`/`leads` row; return counts.
- **`bulkActions/reassign/route.ts`** — V: POST — DB: `clients`(fU,up)
  — Note: reassign customers to another sales rep. Mock: update `sales_rep_id` on each.
- **`bulkActions/leadTemperature/route.ts`** — V: POST — DB: `clients`(fU,up)
  — bulk temperature set.
- **`bulkActions/consentSms/route.ts`** — V: POST — DB: `clients`(up)
  — bulk consent-SMS opt flag.

### 8.6 `callAnsweredBy` (Twilio)

- **`callAnsweredBy/[conferenceSid]/route.ts`** — V: DELETE — DB: `client_calls`(fU,up),
  `users`(fU)
  — Note: ends a call conference and logs who answered. Mock: update the seed
  `client_calls` row matching the SID; return canned success.

### 8.7 `callStatus` (Twilio)

- **`callStatus/route.ts`** — V: POST — DB: `call_statuses`(fF), `client_calls`(up)
  — Note: Twilio status webhook. Mock: look up status by `CallStatus` form field, update
  the in-memory call row; keep the `{ ok: true }` style response.
- **`callStatus/[callSid]/route.ts`** — V: POST — DB: `client_calls`(cr,fU),
  `client_has_lead`(cr)
  — Note: call lifecycle handler (answered/hangup etc.). Mock: create/update the call row
  and, if connected, create a `client_has_lead`.

### 8.8 `callTransfer` (Twilio)

- **`callTransfer/[callSid]/route.ts`** — V: POST — *(no DB — uses Twilio REST + zod)*
  — Note: initiates a call transfer via the Twilio API. Mock: validate with the same zod
  schema (422 on failure) and return a canned success object without calling Twilio.

### 8.9 `conferenceTransfer` (Twilio)

- **`conferenceTransfer/[conferenceSid]/route.ts`** — V: POST — DB: `client_calls`(fU)
  — Note: transfers an active conference. Mock: look up call row by SID, return success.

### 8.10 `consentForm`

- **`consentForm/[id]/route.ts`** — V: PUT — DB: `clients`(fU,up), `leads`(fF,up),
  `client_address`(fF,cr,up), `consent_code`(fU,del), `consent_terms`(fF),
  `customer_consent_logs`(cr), `terms_and_conditions_processed`(cr,delM,fM)
  — Note: the public consent submission — validates code, updates customer data, logs
  consent. Mock: mutate seed client/address, consume the code (delete), push a consent log
  + processed-terms row; return the customer object.

### 8.11 `consentTerms`

- **`consentTerms/statement/route.ts`** — V: GET — DB: `consent_terms`(fF) — static statement.
- **`consentTerms/statement/[id]/route.ts`** — V: PUT — DB: `consent_terms`(up) — edit statement.
- **`consentTerms/checks/route.ts`** — V: GET,PUT — DB: `consent_checks`(fM,ups)
  — Note: consent checkboxes list + reorder/rename via upsert.
- **`consentTerms/checks/[id]/route.ts`** — V: DELETE — DB: `consent_checks`(del) — remove check.

### 8.12 `conversation`

- **`conversation/route.ts`** — V: PUT — DB: `conversation`(cr,up), `client_has_lead`(cr),
  `notes`(cr)
  — Note: saves a conversation transcript/note against a lead. Mock: upsert into
  `mockDb.conversation`, push note.

### 8.13 `creditAppCode`

- **`creditAppCode/route.ts`** — V: POST — DB: `credit_app_code`(fU,cr,del)
  — Note: generate a credit-app access code (token). Mock: generate a pseudo-random token,
  store in `mockDb.credit_app_code`, expire old codes.
- **`creditAppCode/send/[id]/route.ts`** — V: POST — DB: `clients`(fU,up), `client_sms`(cr)
  — Note: SMS the code to the customer. Mock: build canned SMS text with the code, push a
  `client_sms` row, return success.

### 8.14 `creditAppNav`

- **`creditAppNav/[id]/route.ts`** — V: GET — DB: `credit_app_navigation`(fU)
  — Note: which credit-app steps are complete. Mock: return seed navigation row for the id.

### 8.15 `customerData`

- **`customerData/route.ts`** — V: POST — DB: `clients`(fU,cr), `leads`(cr), `client_address`(cr),
  `lead_types`(fU), `lead_sources`(fU), `client_status`(fU), `io`(cr)
  — Note: customer/lead creation (sign-up path). Mock: push client + lead + address into
  seed arrays; return created record.

### 8.16 `customerDetail`

- **`customerDetail/leadHistory/[id]/route.ts`** — V: GET — DB: `client_has_lead`(fM),
  `tasks`(fM)
  — Note: lead status history timeline. Mock: assemble from seed `client_has_lead` +
  `tasks` filtered by id.

### 8.17 `customerSelect`

- **`customerSelect/route.ts`** — V: GET — DB: `clients`(fM)
  — Note: lightweight search dropdown. Mock: filter seed clients by name/phone.

### 8.18 `dashboardSearch`

- **`dashboardSearch/route.ts`** — V: POST — DB: `clients`(fM)
  — Note: global dashboard search. Mock: case-insensitive match on name/phone/email over
  seed clients.

### 8.19 `deal`

- **`deal/route.ts`** — V: POST — DB: `deal`(cr,fF), `clients`(fU,up), `leads`(fF,up),
  `banks`(fU), `amountPerDate`(cr), `paymentDate`(cr)
  — Note: creates a sale/deal with payment schedule. Mock: push deal + its payment rows;
  update client/lead status to sold.
- **`deal/[id]/route.ts`** — V: GET,PUT — DB: `deal`(fF,up,cr), `leads`(fF), `banks`(fM),
  `amountPerDate`(cr,delM), `paymentDate`(cr,delM)
  — Note: deal detail + edit (replaces payment rows). Mock: mutate deal, rebuild payment
  arrays.

### 8.20 `defaultPhoneNumber`

- **`defaultPhoneNumber/[id]/route.ts`** — V: PUT — DB: `clients`(up)
  — Note: set which phone is the default for a customer. Mock: mutate client field.

### 8.21 `deliveryStatus`

- **`deliveryStatus/[id]/route.ts`** — V: PUT — DB: `clients`(fF,up), `leads`(fF,up)
  — Note: mark vehicle delivered. Mock: set delivery flag on client + lead.

### 8.22 `disableSelects`

- **`disableSelects/route.ts`** — V: GET — DB: `disable_select_values`(fM)
  — Note: which dropdowns are disabled per user/business. Mock: return static/seed array.

### 8.23 `email`

- **`email/[id]/route.ts`** — V: POST — DB: `leads`(upM), `client_has_lead`(cr)
  — Note: records an email sent to a lead. Mock: push `client_has_lead` row, mark lead
  emailed.
- **`email/favoriteTemplate/[id]/route.ts`** — V: PUT — DB: `email_template`(fU,up)
  — Note: toggle favorite flag. Mock: mutate template row.
- **`email/massive/route.ts`** — V: POST — DB: `clients`(fM), `client_has_lead`(cr)
  — Note: bulk email send. Mock: loop clients, push `client_has_lead` rows; return counts.

### 8.24 `endVisitCustomerInfoEdited`

- **`endVisitCustomerInfoEdited/[id]/route.ts`** — V: PUT — DB: `clients`(up), `users`(up)
  — Note: end-of-visit customer edit. Mock: mutate client + optional user fields.

### 8.25 `eventsTypes`

- **`eventsTypes/route.ts`** — V: GET — DB: `events_types`(fM) — static seed.

### 8.26 `fundedList`

- **`fundedList/[id]/route.ts`** — V: PUT — DB: `clients`(fF,up), `leads`(fF,up), `notes`(cr)
  — Note: mark deal funded. Mock: set funded flag + add note.

### 8.27 `incident`

- **`incident/route.ts`** — V: POST — DB: `incidents`(cr)
  — Note: create an incident report. Mock: push into `mockDb.incidents`, return record.

### 8.28 `incomingCallerIdentity`

- **`incomingCallerIdentity/[phoneNumber]/route.ts`** — V: GET — DB: `clients`(fF)
  — Note: lookup customer by caller phone (used by phone UI). Mock: find in seed clients
  by `mobile_phone`/`home_phone`; return customer (or null → generic).

### 8.29 `inventory`

#### Lookup tables (all `findMany` → static seed arrays)
- **`inventory/acqType/route.ts`** — DB: `detail_acq_mill_type`
- **`inventory/color/route.ts`** — DB: `vehicle_colors`
- **`inventory/condition/route.ts`** — DB: `vehicle_conditions`
- **`inventory/detailCondition/route.ts`** — DB: `detail_condition`
- **`inventory/driveTrain/route.ts`** — DB: `vehicle_drive_train`
- **`inventory/emissionStatus/route.ts`** — DB: `emission_status`
- **`inventory/engine/route.ts`** — DB: `vehicle_engine`
- **`inventory/fuelType/route.ts`** — DB: `vehicle_fuel_tank_types`
- **`inventory/inspectionStatus/route.ts`** — DB: `inspection_status`
- **`inventory/make/route.ts`** — DB: `vehicle_make`
- **`inventory/model/route.ts`** — DB: `vehicle_models`
- **`inventory/odometer/route.ts`** — V: GET — *(no DB — returns static/derived list)*
- **`inventory/odometerType/route.ts`** — DB: `vehicle_milleage_type`
- **`inventory/paymentMethod/route.ts`** — DB: `payment_method`
- **`inventory/salesType/route.ts`** — DB: `sales_type_category`
- **`inventory/source/route.ts`** — DB: `detail_source`
- **`inventory/status/route.ts`** — DB: `vehicle_status`
- **`inventory/titleBrand/route.ts`** — DB: `title_brand`
- **`inventory/titleStatus/route.ts`** — DB: `title_status`
- **`inventory/transmission/route.ts`** — DB: `vehicle_transmissions`
- **`inventory/trim/route.ts`** — DB: `vehicle_trim`
- **`inventory/type/route.ts`** — DB: `vehicle_types`

#### Vehicle CRUD & sections
- **`inventory/vehicle/route.ts`** — V: GET,POST — DB: `vehicles`(fM,cr), `vehicle_identification_numbers`(cr,ups),
  `vehicle_make`(ups), `vehicle_models`(ups), `vehicle_manufacture_years`(ups),
  `vehicle_trim`(ups), `vehicle_body_types`(ups), `vehicle_engine`(ups), `vehicle_image`(cr),
  `general_info`(cr), `emission_status_data`(cr), `inspection_status_data`(cr),
  `vehicle_details_key_info`(cr), `vehicle_details_purchase_info`(cr), `vehicle_details_title_license`(cr)
  — Note: master inventory list (GET, with filters) + full vehicle create (POST, creates
  nested records). Mock: seed ~20 vehicles with full nested shape; POST pushes a vehicle +
  its nested section records.
- **`inventory/vehicle/[id]/route.ts`** — V: GET,DELETE — DB: `vehicles`(fU,del)
  — Note: single vehicle + delete. Mock: return seed by id (404 if missing); delete removes
  from array.
- **`inventory/vehicleStatus/[id]/route.ts`** — V: PUT — DB: `vehicles`(up) — set status.
- **`inventory/vinNumber/[vin]/route.ts`** — V: GET — DB: `vehicle_identification_numbers`(fU)
  — Note: duplicate-VIN check. Mock: search seed vin records; return `{ exists: ... }`-style
  response the UI expects.
- **`inventory/addVehicle/[id]/route.ts`** — V: PUT — DB: `vehicles`(cr,up,ups),
  `vehicle_identification_numbers`(ups), `vehicle_make`(ups), `vehicle_models`(ups),
  `vehicle_manufacture_years`(ups), `vehicle_trim`(ups), `vehicle_body_types`(ups),
  `vehicle_engine`(ups), `vehicle_image`(cr,ups)
  — Note: add-vehicle form partial save. Mock: upsert lookup rows + vehicle + images.
- **`inventory/generalInfo/[id]/route.ts`** — V: PUT — DB: `vehicles`(fU,up),
  `general_info`(cr,up), `emission_status_data`(cr,up), `inspection_status_data`(cr,up),
  `vehicle_details_purchase_info`(cr,up)
  — Note: general/purchase section save. Mock: upsert the section rows on the vehicle.
- **`inventory/keyInfo/[id]/route.ts`** — V: PUT — DB: `vehicles`(fU,up),
  `vehicle_details_key_info`(cr,up) — key-info section save.
- **`inventory/titleLicense/[id]/route.ts`** — V: PUT — DB: `vehicles`(fU,up),
  `vehicle_details_title_license`(cr,up) — title/license section save.
- **`inventory/importData/route.ts`** — V: GET,POST — DB: `vehicles`(cr,fU,ups),
  `vehicle_identification_numbers`(cr,fF,ups), `vehicle_make`(fF,cr), `vehicle_models`(fF,cr),
  `vehicle_manufacture_years`(fF,cr), `vehicle_trim`(fF,cr), `vehicle_body_types`(fF,cr),
  `vehicle_colors`(fF,cr), `vehicle_engine`(fF,cr), `vehicle_transmissions`(fF,cr)
  — Note: bulk import + fetch for import form. Mock: upsert lookups then push vehicles;
  GET returns lookup reference arrays.
- **`inventory/swapSoldVehicle/route.ts`** — V: POST — DB: `clients`(fU), `vehicles`(fU)
  — Note: swap a sold vehicle assignment. Mock: lookups + return both rows.

### 8.30 `lead`

- **`lead/[id]/route.ts`** — V: GET,POST,PUT,DELETE — DB: `leads`(fF,fM,cr,up,del,upM),
  `clients`(fU,cr,up), `events`(cr)
  — Note: the lead workspace CRUD (full update, create with client, delete). Mock: all
  mutations against seed arrays; return the refreshed lead + client.

### 8.31 `letterhead`

- **`letterhead/route.ts`** — V: GET,POST — DB: `letterhead`(fF,cr,up),
  `header_email_template`(cr,up), `footer_email_template`(cr,up)
  — Note: letterhead + header/footer templates. Mock: get-or-create single record set;
  POST updates them.
- **`letterhead/[id]/route.ts`** — V: PUT — DB: `letterhead`(fU,up) — update letterhead.

### 8.32 `lostReasons`

- **`lostReasons/route.ts`** — V: GET — DB: `lost_reasons`(fM) — static seed.

### 8.33 `message`

- **`message/route.ts`** — V: GET — DB: `client_sms`(fM) — message list (desc).
- **`message/[mobilePhone]/route.ts`** — V: GET,POST — DB: `client_sms`(fM,cr,upM),
  `leads`(fF,up), `awaiting_unknow_client`(cr,fF), `business_phone_numbers`(fM)
  — Note: conversation thread by phone + send message (Twilio SMS). Mock: filter `client_sms`
  by phone for GET; POST pushes a message and returns the thread.
- **`message/v2/[clientId]/route.ts`** — V: GET — DB: `client_sms`(fM)
  — Note: thread by client id (+ Twilio websocket env constants — leave constants as-is,
  no calls made on GET). Mock: filter by client id.
- **`message/massive/route.ts`** — V: POST — DB: `clients`(fM,up), `client_has_lead`(cr),
  `client_Bulk_sms`(cr)
  — Note: bulk SMS send. Mock: loop recipients, push a `client_Bulk_sms` row, return summary.
- **`message/status/[id]/route.ts`** — V: PUT — DB: `client_sms`(upM) — mark read/delivered.
- **`message/favoriteTemplate/[id]/route.ts`** — V: PUT — DB: `sms_template`(fU,up) — favorite flag.
- **`message/templateStatus/[id]/route.ts`** — V: PUT — DB: `sms_template`(up) — enable/disable.
- **`message/smsTemplate/route.ts`** — V: GET — DB: `sms_template`(fM) — template list.
- **`message/smsTemplateCategory/route.ts`** — V: GET — DB: `sms_template_category`(fM) — static seed.
- **`message/smsTemplateVariables/route.ts`** — V: GET — DB: `sms_template_variables`(fM) — static seed.

### 8.34 `permissions`

- **`permissions/[id]/route.ts`** — V: GET — DB: `roles_has_permissions`(fU)
  — Note: permission list for a role. Mock: filter `mockDb.roles_has_permissions` by role id.

### 8.35 `public` (unauthenticated credit app)

- **`public/creditApp/start/[id]/route.ts`** — V: PUT — DB: `clients`(up), `credit_app`(ups),
  `credit_app_navigation`(ups)
  — Note: public SSN/DOB step (code-verified). Mock: upsert on seed rows; same as
  adminDashboard start but PUT-only.
- **`public/creditApp/address/[id]/route.ts`** — V: POST — DB: `credit_app_address`(fU,ups),
  `credit_app_address_prev`(delM,fM), `credit_app_navigation`(fU,ups)
- **`public/creditApp/employmentStatus/[id]/route.ts`** — V: POST — DB:
  `customer_employment`(delM,ups), `credit_app_navigation`(fU,ups)
- **`public/creditApp/references/[id]/route.ts`** — V: POST — DB: `clients`(fU,up),
  `credit_app_code`(fU,del), `credit_app_reference`(fM,ups,delM),
  `credit_app_other_income`(fF,up,ups), `leads`(fF,up)
  — Note: last step — consumes the access code (delete) and finalizes. Mock: delete the
  seed code row, save references, mark client complete.

### 8.36 `reports` (heavy aggregation; all GET-oriented)

#### BDC / Funding / Differed
- **`reports/bdcLog/route.ts`** — V: GET — DB: `leads`(fM) — BDC activity rows (date filters).
- **`reports/bdcLog/statistics/route.ts`** — V: GET — DB: `leads`(fM), `users`(fM)
  — Note: per-user stats computed server-side. Mock: compute counts from seed leads.
- **`reports/differed/route.ts`** — V: GET — DB: `deal`(fM) — differed-deals list.
- **`reports/differed/sales-statistics/route.ts`** — V: GET — DB: `deal`(fM) — stats.
- **`reports/fundingLog/route.ts`** — V: GET — DB: `leads`(fM) — funding log rows.
- **`reports/fundingLog/statistics/route.ts`** — V: GET — DB: `leads`(fM), `users`(fM).
- **`reports/fundingLog/tableModifications/[id]/route.ts`** — V: PUT — DB: `clients`(up),
  `deal`(up), `leads`(up) — inline edit in funding log.

#### Sales Log
- **`reports/salesLog/route.ts`** — V: GET — DB: `deal`(fM), `charges_back`(agg)
  — Note: sales log with computed totals (aggregate). Mock: compute totals from seed deals.
- **`reports/salesLog/banks/route.ts`** — V: GET — DB: `deal`(fM) — deals grouped by bank.
- **`reports/salesLog/charges/route.ts`** — V: GET,POST — DB: `charges_back`(fM,cr),
  `business`(fF) — charge-backs list + create.
- **`reports/salesLog/sales-score/route.ts`** — V: GET — DB: `deal`(grp), `other_sales_log`(fM),
  `users`(fM) — Note: sales scoreboard; compute scores from seed.
- **`reports/salesLog/sales-score/add-other/route.ts`** — V: GET,POST — DB:
  `other_sales_log`(cr), `other_vehicle`(cr,fM).
- **`reports/salesLog/sources/route.ts`** — V: GET — DB: `deal`(fM), `business`(fF),
  `marketing_cost`(fM) — source + marketing-cost rows.
- **`reports/salesLog/sources/[id]/marketing-cost/route.ts`** — V: PUT — DB:
  `marketing_cost`(cr,fF,up), `business`(fF) — set/upsert cost per source.

#### Store Report
- **`reports/storeReport/activitiesReport/route.ts`** — V: GET — DB: `client_has_lead`(fM).
- **`reports/storeReport/birthdayReport/route.ts`** — V: GET — DB: `clients`(fM)
  — Note: filter seed clients by birth month.
- **`reports/storeReport/bulkSms/route.ts`** — V: GET — DB: `client_Bulk_sms`(fM).
- **`reports/storeReport/callActivity/route.ts`** — V: GET — DB: `client_calls`(fM),
  `client_sms`(fM), `users`(fM), `users_has_customers`(fM) — Note: combined call/SMS log;
  assemble from seed.
- **`reports/storeReport/callActivity/inbound/[id]/route.ts`** — V: GET — DB: `client_calls`(fM).
- **`reports/storeReport/callActivity/outbound/[id]/route.ts`** — V: GET — DB: `client_calls`(fM).
- **`reports/storeReport/callActivity/smsDetail/[id]/route.ts`** — V: GET — DB: `client_sms`(fM).
- **`reports/storeReport/comissionReport/route.ts`** — V: GET — DB: `leads`(fM), `users`(fM).
- **`reports/storeReport/comissionReport/bdc/route.ts`** — V: GET — DB: `leads`(fM), `users`(fM).
- **`reports/storeReport/comissionReport/bdc/[id]/route.ts`** — V: GET — DB: `leads`(fM).
- **`reports/storeReport/comissionReport/salesConsultant/route.ts`** — V: GET — DB:
  `leads`(fM), `users`(fM).
- **`reports/storeReport/comissionReport/salesConsultant/[id]/route.ts`** — V: GET — DB: `leads`(fM).
- **`reports/storeReport/comissionReport/amount/[id]/route.ts`** — V: GET,PUT — DB:
  `comission_info`(fU,ups), `comission_salary`(ups), `comission_bonus`(ups,delM),
  `comission_spiff`(ups,delM,crM)
  — Note: commission breakdown editor. Mock: upsert the info/salary rows, replace
  bonus/spiff arrays.
- **`reports/storeReport/creditApp/route.ts`** — V: GET — DB: `credit_app`(fM), `leads`(fM).
- **`reports/storeReport/referrerReport/route.ts`** — V: GET — DB: `leads`(fM).
- **`reports/storeReport/referrerReport/refScore/route.ts`** — V: GET — DB: `leads`(fM).
- **`reports/storeReport/referrerReport/amount/[id]/route.ts`** — V: PUT — DB:
  `clients_has_referrer`(up) — set referrer payout.
- **`reports/storeReport/salesActivity/route.ts`** — V: GET — DB: `appointments`(fM),
  `client_calls`(fM), `client_sms`(fM), `deal`(fM), `sales_activity_log`(grp),
  `tasks`(fM), `users`(fM), `users_has_customers`(fM) — Note: combined sales activity log.
- **`reports/storeReport/salesConversion/route.ts`** — V: GET — DB: `leads`(fM), `users`(fM).
- **`reports/storeReport/salesConversion/[id]/route.ts`** — V: GET — DB: `leads`(fM).
- **`reports/storeReport/salesRepScore/route.ts`** — V: GET — DB: `clients`(fM), `deal`(fM),
  `sales_activity_log`(grp), `salesGoalsConfig`(fF,fM), `users`(fM)
  — Note: rep scoreboard vs goals; compute in-memory from seed.
- **`reports/storeReport/salesRepScoreLeader/route.ts`** — V: GET — DB: `deal`(fM), `leads`(fM),
  `salesGoalsConfig`(fF,fM), `users`(fM) — leaderboard.
- **`reports/storeReport/salesRepScoreLeader/[id]/monthly-goals/route.ts`** — V: PUT — DB:
  `monthly_goals`(cr,fF,up), `business`(fF) — set monthly goal.
- **`reports/storeReport/smsReport/route.ts`** — V: GET — DB: `client_sms`(grp), `users`(fM).
- **`reports/storeReport/sold-customers/route.ts`** — V: GET — DB: `clients`(fM)
  — Note: uses `buildDatePrismaFilter`. Mock: filter seed clients by date range.
- **`reports/storeReport/sold-customers/deal/[id]/route.ts`** — V: GET — DB: `deal`(fU).
- **`reports/storeReport/sold-customers/deal/[id]/receipt/route.ts`** — V: POST — DB:
  `dealReceipt`(cr), `deal`(up), `amountPerDate`(upM), `paymentDate`(cr)
  — Note: receipt generation for a sold deal. Mock: push receipt + payment rows, return
  the receipt object.
- **`reports/storeReport/taskActivity/[id]/route.ts`** — V: GET — DB: `tasks`(fM), `users`(fU).
- **`reports/storeReport/visitReport/route.ts`** — V: GET — DB: `daily_visit_history`(fM),
  `leads`(fM).

### 8.37 `rescheduleSms`

- **`rescheduleSms/route.ts`** — V: GET — DB: `rescheduleSms`(fF) — single template.
- **`rescheduleSms/[id]/route.ts`** — V: PUT — DB: `rescheduleSms`(up) — update template.

### 8.38 `settings`

- **`settings/automaticSms/route.ts`** — V: GET,POST,PUT — DB: `automatic_sms`(fF,cr,up)
  — Note: automatic-SMS triggers config. Mock: single seed record get-or-create + update.
- **`settings/automaticEmails/route.ts`** — V: GET,POST,PUT — DB: `automatic_emails`(fF,cr,up)
  — same pattern.
- **`settings/automatedReview/route.ts`** — V: GET,POST — DB: `automated_review`(fM,cr).
- **`settings/automatedReview/[id]/route.ts`** — V: DELETE — DB: `automated_review`(del).
- **`settings/customBeBackReasons/route.ts`** — V: GET,POST — DB: `custom_be_back_reasons`(fM,cr).
- **`settings/customBeBackReasons/[id]/route.ts`** — V: DELETE — DB: `custom_be_back_reasons`(del).
- **`settings/customLostReason/route.ts`** — V: GET,POST — DB: `custom_lost_reasons`(fM,cr).
- **`settings/customLostReason/[id]/route.ts`** — V: DELETE — DB: `custom_lost_reasons`(del).
- **`settings/customNoSaleReasons/route.ts`** — V: GET,POST — DB: `custom_no_sale_reasons`(fM,cr).
- **`settings/customNoSaleReasons/[id]/route.ts`** — V: DELETE — DB: `custom_no_sale_reasons`(del).
- **`settings/customerSettings/route.ts`** — V: GET,POST — DB: `customer_settings`(fF,cr).
- **`settings/customerSettings/[id]/route.ts`** — V: PUT — DB: `customer_settings`(up).
- **`settings/customerSettings/taskSettings/route.ts`** — V: GET,POST — DB: `task_settings`(fF,cr).
- **`settings/customerSettings/taskSettings/[id]/route.ts`** — V: PUT — DB: `task_settings`(up).
- **`settings/emailTemplate/route.ts`** — V: GET,POST — DB: `email_template`(fM,cr),
  `header_email_template`(fF,cr), `footer_email_template`(fF,cr), `letterhead`(fF)
  — Note: email template list + create (with header/footer/letterhead lookup).
- **`settings/emailTemplate/[id]/route.ts`** — V: GET,PUT — DB: `email_template`(fU,up,cr),
  `header_email_template`(fF), `footer_email_template`(fF), `letterhead`(fF).
- **`settings/emailTemplate/templatePublish/[id]/route.ts`** — V: PUT — DB: `email_template`(up)
  — publish/unpublish flag.
- **`settings/emailToLead/route.ts`** — V: GET,POST — DB: `email_to_lead`(fM,cr) — routing rules.
- **`settings/emailToLead/[id]/route.ts`** — V: DELETE — DB: `email_to_lead`(del).
- **`settings/paymentTypes/route.ts`** — V: GET — DB: `payment_types`(fM) — static seed.
- **`settings/trackingCode/route.ts`** — V: POST — DB: `tracking_code`(cr) — save tracking code.
- **`settings/unknownAdfElements/route.ts`** — V: GET,POST — DB: `unknown_adf_elements`(fM,cr).
- **`settings/unknownAdfElements/[id]/route.ts`** — V: DELETE — DB: `unknown_adf_elements`(del).
- **`settings/voiceAndEmails/route.ts`** — V: GET,POST,PUT — DB: `voice_and_sms`(fF,cr,up),
  `business_phone_numbers`(fM)
  — Note: master voice & SMS config + registered numbers.
- **`settings/voiceAndEmails/available-numbers/route.ts`** — V: GET,POST — *(no DB — Twilio
  `availablePhoneNumbers` REST call)*
  — Note: mock returns a canned list of ~10 available numbers matching the requested area
  code; keep 404-on-empty behavior.
- **`settings/voiceAndEmails/registered-numbers/route.ts`** — V: GET,POST — DB:
  `business_phone_numbers`(fM,cr), `business`(fF) — registered numbers list + register
  (POST may call Twilio purchase — mock: just push the number).
- **`settings/voiceAndEmails/registered-numbers/[id]/activate/route.ts`** — V: PUT — DB:
  `business_phone_numbers`(fF,up) — activate/deactivate number.
- **`settings/voiceAndEmails/limitWarningRecipients/route.ts`** — V: GET,POST — DB:
  `sms_limit_warning_recipients`(fM,cr).
- **`settings/voiceAndEmails/limitWarningRecipients/[id]/route.ts`** — V: DELETE — DB:
  `sms_limit_warning_recipients`(del).
- **`settings/voiceAndEmails/nameDisplayedEmail/route.ts`** — V: GET — DB:
  `email_name_displayed`(fM) — static seed.
- **`settings/voiceAndEmails/forwardIncomingCalls/route.ts`** — V: GET — DB:
  `incoming_calls_options`(fM) — static seed.

### 8.39 `systemAccesses`

- **`systemAccesses/route.ts`** — V: GET — DB: `system_accesses`(fM)
  — Note: list of active user sessions/accesses (with `checkPermissions(43)` guard).
  Mock: return seed accesses incl. the demo user; keep the guard.

### 8.40 `taskDueTimeLimit`

- **`taskDueTimeLimit/route.ts`** — V: GET — DB: `task_due_time_limit`(fM) — static seed.

### 8.41 `transferNoAnsweredConference` (Twilio)

- **`transferNoAnsweredConference/[conferenceName]/route.ts`** — V: POST — DB:
  `conferences_names`(up)
  — Note: marks a conference as transferred/no-answer. Mock: update seed conference row,
  return canned TwiML/success.

### 8.42 `twilioDeviceToken` (Twilio)

- **`twilioDeviceToken/[email]/route.ts`** — V: GET — *(no DB — generates Twilio JWT)*
  — Note: mock generates a fake-but-valid-shaped JWT string (or a base64 placeholder) and
  returns the same JSON shape; phone UI only needs a token string.

### 8.43 `twiml` (Twilio)

- **`twiml/route.ts`** — V: POST — DB: `business_phone_numbers`(fF)
  — Note: Twilio voice webhook returning TwiML. Mock: look up registered number for routing
  and return the same TwiML XML the route builds today (dial/gather based on seed number).

### 8.44 `user`

- **`user/userImage/[id]/route.ts`** — V: GET — DB: `users`(fU)
  — Note: returns the user image (file). Mock: return a seeded image buffer/URL or a
  `404`-style placeholder consistent with current behavior.

### 8.45 `userPicker`

- **`userPicker/[id]/route.ts`** — V: PUT — DB: `clients`(fU,up), `leads`(fF,up),
  `appointments`(up), `users_has_customers`(cr)
  — Note: (re)assign owner of a customer. Mock: update `sales_rep_id` on client + lead +
  appointments; add assignment row.

### 8.46 `vehiclePicker`

- **`vehiclePicker/[id]/route.ts`** — V: PUT — DB: `clients`(up), `leads`(up)
  — Note: assign interested vehicle to a customer/lead. Mock: set `vehicle_id` on both.

### 8.47 `vinDecode` (external API)

- **`vinDecode/route.ts`** — V: POST — *(no DB — calls vindecoder.eu)*
  — Note: mock returns a canned VIN-decode JSON (year/make/model/engine/etc.) for any VIN;
  keep the 500-on-error branch.

### 8.48 `waitConferenceUrl` (Twilio)

- **`waitConferenceUrl/[conferenceName]/route.ts`** — V: POST — *(no DB — returns TwiML)*
  — Note: returns the same wait/hold TwiML the route builds today, parameterized by the
  conference name.

---

## 9. Cross-Cutting Implementation Notes

### 9.1 Helper modules that must be mocked alongside route files
These `libs` are imported by route handlers and still contain real `prisma` calls. They
must be converted or short-circuited in the same step as the routes that use them:

- `src/app/libs/data.ts` — the largest helper surface (`getUserEmailAndPassword`,
  `getAllUsers`, `getAllClients`, `getAllVehicles`, `getAllAppointments`,
  `getAConsentCode`, `getCustomerCreditAppData`, `getCustomerAddress`,
  `getCreditAppEmploymentPreliminary`, `getChecks`, `getStatement`, ...). Strategy: each
  function delegates to `mockDb` with the same return shape.
- `src/app/libs/actions.ts`, `src/app/libs/fetching.ts` — data access helpers.
- `src/app/libs/events/events.ts` (`createEvent`), `src/app/libs/generalLead/generalLead.ts`
  (`createGeneralLead`), `src/app/libs/notifications/notifications.ts`
  (`createNotification`), `src/app/libs/round-robin.ts` — side-effect helpers called by
  routes; mock to no-op with a returned id.
- `src/app/libs/services/...` — `email.service`, `raundRobin.services`,
  `salesPointsService`, `customers/customer.services`, `customers/profile.services`.
- `src/app/libs/uploadImages.services.ts` — return placeholder URL instead of GCS.
- `src/app/libs/smsTemplateFunctionsAndTwilioSms.ts` — build template strings; keep the
  string-building, skip the real Twilio send.

### 9.2 Files with NO database surface (mock at the route level only)
`auth/[...nextauth]`, `callTransfer`, `settings/voiceAndEmails/available-numbers`,
`twilioDeviceToken`, `vinDecode`, `waitConferenceUrl`, `inventory/odometer`,
`reports/storeReport/sold-customers` (DB yes), `adminDashboard/reports/customer-list/sendReportEmail`
(DB no). These never call `prisma`; they need canned external responses (Twilio/VIN/email).

### 9.3 Files that depend on `buildDatePrismaFilter`
`reports/storeReport/sold-customers`, `adminDashboard/clients/by-filters`.
Replace `buildDatePrismaFilter` output with an in-memory date predicate in `mockDb`
(date-range + option handling).

### 9.4 Ordering within a folder
Inside a folder, convert files in this order so dependencies resolve cleanly:
1. GET reference-list routes (static seeds) → build the `mockDb` arrays.
2. GET list/detail routes → verify read shapes against seed data.
3. Mutation routes (POST/PUT/DELETE) → verify in-memory writes.
4. Twilio/external routes → canned responses last.

### 9.5 Explicitly preserved behaviors (must not regress)
- All `revalidatePath(...)` calls.
- `checkPermissions(...)` guards + their 401/403 responses.
- Zod validation and its 422 `fieldErrors` responses.
- `force-dynamic` exports and any custom headers.
- The `console.log(error)` + `{ serverError: 'Server Error' }` 500 pattern (keep, so the UI
  error handling never changes).
