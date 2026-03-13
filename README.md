# hotel-ui

This repository publishes two static Next.js frontends to GitHub Pages:

- Guest PWA at `/hotel-ui/`
- Admin web app at `/hotel-ui/admin/`

The frontend codebase is an npm workspaces monorepo stored under `frontend/`.

## Repository layout

- `.github/` — GitHub Actions and Copilot instructions
- `frontend/apps/guest/` — Guest-facing PWA
- `frontend/apps/admin/` — Admin web app
- `frontend/packages/shared/` — Shared types, services, UI, hooks, contexts, and i18n

## Getting started

Install dependencies:

```bash
cd frontend
npm install --legacy-peer-deps
```

Run the guest app:

```bash
cd frontend
npm run dev:guest
```

Run the admin app:

```bash
cd frontend
npm run dev:admin
```

Build both static exports:

```bash
cd frontend
npm run build
```

The GitHub Pages workflow installs and builds from `frontend/`, then merges the guest export to the site root and the admin export to `admin/`.

## Notes

- There is currently no automated test runner configured.
- Both apps are exported as static sites for GitHub Pages deployment.
