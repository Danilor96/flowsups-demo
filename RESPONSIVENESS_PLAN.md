# Responsiveness Implementation Plan

**Goal:** Keep desktop (`lg`, >=1024px) exactly as-is with its vw/vh design. Below `lg`, every page/component becomes fully responsive: re-flowing layouts, readable fonts, no clipping, scrollable/card tables, sheet-style modals.

## Foundational strategy (applies to all phases)

- **Preserve desktop untouched:** all existing `[vw]`/`[vh]` classes remain the base; responsive variants (`sm:`, `md:`, `lg:`) are **additive overrides** that only kick in below 1024px.
- **Breakpoints:** Tailwind defaults — `sm` 640 / `md` 768 / `lg` 1024.
- **Patterns per concern:**
  | Concern | Desktop | Below `lg` |
  |---|---|---|
  | Page/container sizing | `w-[Xvw] h-[Yvh]` | `w-full max-w-* h-auto` |
  | Fonts | `text-[Xvh]` | `text-sm..text-xl` (min ~14px) |
  | Fixed heights | `h-[Yvh]` | `min-h` + natural flow |
  | Wide tables | fixed columns | `overflow-x-auto` wrapper or card layout |
  | Modals | `w-[Xvw] h-[Yvh]` centered | `w-full h-full`/`max-h-[90vh]` bottom-sheet + `overflow-y-auto` |
  | Popovers | anchored `right-[Xvw]` | full-width centered dropdown |
  | Navbar | horizontal bar | logo + hamburger menu |

## Phase 0 — Foundation
1. Verify viewport meta (Next.js adds it by default — confirm).
2. Add shared utilities to `globals.css`: `.scrollable-x`, `.lg-only`/`.below-lg-only` helpers, mobile overflow rules, and a small set of reusable component classes (card, sheet-modal) to avoid repeating overrides across 587 files.
3. Add mobile overrides for the FullCalendar + scrollbar blocks in `globals.css`.

## Phase 1 — Public pages (7 pages, ~15 components)
`page.tsx` (login), `sign_in`, `sign_up/[code]`, `forgot_password`, `forgot_password/[code]`, `reset_password`, `consent/[code]`, `creditApp/[code]`.
- **Login/sign_up/forgot/reset split screens:** below `lg` stack to one column (form on top), hide or shrink the `57vw` hero image (`lg-only`), cap form `w-[32vw]` -> `w-full max-w-md mx-auto`, remove `h-[100vh]`, remove `vh`-based vertical margins -> `my-*`.
- **consent + creditApp:** already partially `md:`/`lg:` — finish them; fix `px-[1vw]` gutters -> `px-4`, card grids `md:grid-cols-2` -> `grid-cols-1`.

## Phase 2 — Dashboard shell
- `dashboard/layout.tsx`: `w-[100vw] h-[100vh] overflow-hidden` -> `min-h-screen` + scrollable below `lg`.
- `Navbar.tsx`: below `lg` -> logo + hamburger; `NavbarInformation`, `Notifications`, `UserInfo` collapse into a slide-out drawer.
- `AdminDashboard.tsx`: hide carousel prev/next arrows below `lg` (`lg-only`); make slides `w-full` instead of `w-fit`; `DashboardOptions` grid reflows.
- `dashboard/page.tsx` + `dashboard/[new_tab]` + `customer/[id]` + `vehicles` pages: container widths.

## Phase 3 — Main dashboard views/cards
KPI cards, DailyActivity grid, Tasks, Inventory, Flowsups, Sms, DailyAppointments/Calls/Messages/Sells/MadeCreditApp, MissingTasks, and the 15 customer-list screens (`CustomerList`, `NewCustomers`, `SoldCustomers`, ...).
- Card grids: `md:grid-cols-2` / `lg:grid-cols-3`, `gap-[vw]` -> `gap-4`.
- Convert `vh`-based card heights to `min-h-[X]`; font sizes to Tailwind scale.

## Phase 4 — Data tables
`ColoredTable`, `ColoredTableV2`, `Table`, `SalesLogEspecialTable`, list headers, sort controls.
- Below `lg`: wrap in `.scrollable-x` with `min-w` on table so columns aren't crushed; sticky first column optional.
- For the most-used customer tables: consider card layout (name/status/phone stacked) instead of horizontal scroll.

## Phase 5 — Modals & popovers (~25 components)
`ClientSystem` (Add Prospect), `EmailModal`, `SmsModal`, `CustomerDetail`, `UserDetail`, `WorkInProgress`, `Options`, `PhoneSelector`, `CallTransferOptions`, `ToFromDateTimePicker`, `UserSetting`, `NotesWindow`, `PdfContainer`, import/export, `AddNewReport`, `AppointmentDetail`, `TaskDetail`, etc.
- Modal shells: `w-[Xvw] h-[Yvh]` -> below `lg` `inset-x-0 bottom-0 top-auto w-full max-h-[92vh] overflow-y-auto rounded-t-xl` (bottom sheet), inner fixed `vh` blocks -> auto.
- Backdrop `h-[180vh]` special cases -> `min-h-full`.
- Popovers: reposition centered, ensure z-index still works over sheet.

## Phase 6 — Settings & misc
- `settings/*` (users list, userDetail, storeSystem/Business, roundRobin, payPlan, SystemAccesses).
- Import/Export, PDF container, notes, email templates.

## Phase 7 — QA & audit
1. After each phase: `npm run typecheck` (and `npm run build` at phase ends).
2. Manual test at 360 / 768 / 1024 / 1440 / 1920.
3. Audit: grep every remaining `[vh]`/`[vw]` usage not paired with a responsive override; iterate until below-lg is clean.

---

### Work order & estimates
| Phase | Scope | Effort |
|---|---|---|
| 0 Foundation | 2 files | S |
| 1 Public pages | ~23 files | M |
| 2 Dashboard shell | ~10 files | M |
| 3 Dashboard views | ~30 files | L |
| 4 Tables | ~15 files | M |
| 5 Modals | ~25 files | L |
| 6 Settings/misc | ~25 files | M |
| 7 QA/audit | tooling + review | M |