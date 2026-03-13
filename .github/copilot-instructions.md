# Copilot instructions for `hotel-ui`

## Build, lint, and dev commands

This repository keeps the frontend monorepo under `frontend/`, with two Next.js apps and a shared package.

- Install all dependencies: `cd frontend && npm install --legacy-peer-deps`
- Dev server (guest, port 3000): `cd frontend && npm run dev:guest`
- Dev server (admin, port 3001): `cd frontend && npm run dev:admin`
- Build both apps: `cd frontend && npm run build`
- Build one app: `cd frontend && npm run build:guest` or `cd frontend && npm run build:admin`
- Lint both apps: `cd frontend && npm run lint`
- Lint one file: `cd frontend && npx eslint apps/guest/src/path/to/file.tsx`
- There is no test runner configured in this repository.

## High-level architecture

### Monorepo layout

- `frontend/apps/guest/` — Guest-facing PWA (Next.js, static export, basePath `/hotel-ui`)
- `frontend/apps/admin/` — Staff management panel (Next.js, static export, basePath `/hotel-ui/admin`)
- `frontend/packages/shared/` — Shared types, services, UI components, contexts, hooks, and i18n used by both apps

Both apps use `transpilePackages: ["@hotel-ui/shared"]` so the shared package ships raw TypeScript — no separate build step needed.

### Shared package (`@hotel-ui/shared`)

Import shared code via subpath, e.g. `import { Button } from "@hotel-ui/shared/components/ui/button"`. Key modules:

- `types/` — All domain types (Room, Stay, Ticket, Conversation, etc.)
- `services/api.ts` — Mock backend fetching static JSON from `public/data/*.json` via `fetchData<T>()`
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `lib/statusColor.ts` — Ticket status → badge variant / color mappings
- `components/ui/` — Reusable primitives: Button, Badge, Card, Modal, Toast
- `contexts/HotelContext.tsx` — Central hotel state (rooms, stays, staff, tickets, conversations, branding) loaded on mount; exposes `useHotel()` hook
- `hooks/useGuestSession.ts` — Reads guest session from localStorage
- `i18n/` — `I18nProvider` (next-intl) + message files for en, pl, de

### Guest app (`frontend/apps/guest/`)

- Root page (`/`) is the guest onboarding/login (QR-code entry, DOB verification).
- `/guest/**` routes are wrapped by a layout with localStorage session guard and mobile bottom navigation.
- Feature components in `src/components/features/`: AIConcierge, KidsModeToggle, LanguageSwitcher, ResortMap, TicketChat.
- Dynamic ticket route uses a server/client split: `tickets/[id]/page.tsx` generates static params; `client.tsx` renders the interactive UI.
- Configured as a PWA with `manifest.json`, service worker (`public/sw.js`), and apple-web-app meta tags.

### Admin app (`frontend/apps/admin/`)

- Root page (`/`) is the admin login.
- `/(panel)/**` routes are wrapped by a layout with localStorage session guard and sidebar navigation.
- Admin routes use plain Tailwind classes (no glassmorphism/gradient-mesh); simplified `globals.css`.

### Deployment

Both apps are statically exported and deployed to GitHub Pages under `/hotel-ui/`. The deploy workflow builds both, then merges outputs so the guest app serves at `/hotel-ui/` and the admin app at `/hotel-ui/admin/`.

## Key conventions

- Use `@/*` for app-local imports and `@hotel-ui/shared/*` for shared package imports (configured in each app's `tsconfig.json` paths).
- The root provider stack in each app's `layout.tsx` is `I18nProvider → HotelProvider → ToastProvider`.
- Guest and admin sessions are stored in localStorage (`guestSession` / `adminSession`). Layouts enforce auth by checking these keys.
- i18n is client-driven via localStorage (`lang` key) and a custom `localeChange` event for same-tab reactivity. Supported locales: en, pl, de.
- Guest styling uses CSS custom properties and global utility classes (`gradient-mesh`, `glass-panel`, `glass-panel-heavy`, `glow-*`). The `.kids-mode` body class swaps the palette. Prefer these over hard-coded colors.
- Admin styling uses standard Tailwind utility classes directly — no custom CSS layer.
- Reuse `getTicketStatusVariant()` / `getTicketStatusColor()` from `@hotel-ui/shared/lib/statusColor` instead of re-encoding ticket status mappings.
- Mock data lives in each app's `public/data/*.json`. Update these files when changing seed content.
- When adding a new shared component or type, add it to `frontend/packages/shared/` and register its export in the shared package's `package.json` exports field.
