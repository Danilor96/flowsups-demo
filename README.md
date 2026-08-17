# Flowsups CRM (Demo)

A **demo** CRM for car dealerships built with Next.js. It covers customer management, appointments, inventory, SMS/email messaging, daily activity, tasks, reports and settings.

> **This is a demo project.** Almost all functions and functionalities are simulated or simplified, and they are not the final product. The performance you see is for demonstration purposes only.

## Screen size

This project was designed **only for large screens (≥ 1024px)**. Layouts below 1024px may not display correctly. Some basic responsive adaptations exist, but full mobile support is out of scope.

## Demo credentials

| Field    | Value             |
| -------- | ----------------- |
| Email    | `demo@flowsups.com` |
| Password | `demo1234`        |

## Getting started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# production build
npm run build
npm run start
```

> **Note about realtime:** the project contains a WebSocket server (`npm run socket`), but it is **not functional in this demo**. Real-time updates and calls do not work; everything is simulated.

### Useful scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the Next.js dev server         |
| `npm run build`    | Create a production build            |
| `npm run start`    | Serve the production build           |
| `npm run typecheck`| Run TypeScript type checking         |
| `npm run lint`     | Run ESLint                           |
| `npm run socket`   | Start the WebSocket server (not functional in the demo) |

## Tech stack

- **Next.js** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)
- **framer-motion** (animations)
- **TanStack Table** (tables)
- **@dnd-kit** (drag & drop)
- **FullCalendar** (appointments calendar)
- **NextAuth.js** (authentication)
- **Prisma** (ORM definitions) with a **mock database** — there is no real database or backend API; all data comes from `src/app/libs/mock-db`.

## Project structure

```
src/
├── app/
│   ├── page.tsx            # Sign-in page
│   ├── dashboard/          # Dashboard layout + views
│   ├── ui/                 # Reusable UI components (forms, modals, tables, cards…)
│   └── libs/
│       ├── actions.ts      # Server actions (auth, login, etc.)
│       └── mock-db/        # Simulated database (seed users, clients, appointments…)
└── store/                  # Zustand stores
```

Key areas:

- `src/app/ui/dashboard` — navbar, cards, customer system, settings, notifications.
- `src/app/ui/modalWindowsStructure` — shared modal primitives.
- `src/app/ui/table` — table components (`ColoredTable`, `ColoredTableV2`, etc.).
- `src/app/libs/mock-db/data` — seed data for every entity in the app.

## Notes

- Authentication is simulated with NextAuth + the mock database; the demo user above has full `Superuser` permissions.
- Some functions (SMS, calls, emails, printing) use external libraries that may require credentials or network access to work fully.
- The WebSocket/realtime features (`npm run socket`) are **not functional** in this demo — real-time updates and calls have no real functionality.