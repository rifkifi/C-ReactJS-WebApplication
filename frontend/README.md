# Frontend (React + Vite)

React frontend for the C-ReactJS-WebApplication project. Uses Vite for dev/build, Tailwind CSS for styling, React Router for routing, and Axios to talk to the backend API.

## Tech Stack
- React 19, React Router 7
- Vite 7
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Axios, React Hot Toast, React Select
- ESLint (flat config) for linting

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ (or a compatible package manager)

## Install
```
cd frontend
npm install
```

## Development
```
npm run dev
```
Vite dev server runs on `http://localhost:5173`.

API requests are made to relative paths (e.g., `/api/...`). During development, the Vite proxy forwards `/api` to the backend at `http://localhost:5198` (see `vite.config.js`). Ensure the backend is running there.

## Build & Preview
```
npm run build
npm run preview
```
Build outputs to `dist/`. `npm run preview` serves the built assets locally for verification.

## Scripts
- `npm run dev` — start dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — run ESLint

## Configuration
- Dev proxy: `vite.config.js` proxies `/api` to `http://localhost:5198` and enables HMR.
- Styling: Tailwind CSS v4 is configured via the Vite plugin `@tailwindcss/vite`.


## Project Structure
- `src/` — application source
  - `components/` — UI components (cards, forms, header, etc.)
  - `pages/` — route-level pages (Home, Login, Register, Profile, Restaurant, Management)
  - `provider/` — context providers (AuthProvider, CartProvider)
  - `App.jsx` — routes and layout
  - `main.jsx` — app bootstrap

## Auth & API
- Auth is handled via `AuthProvider` using Axios; on login, the received `access_token` is stored in `localStorage` and attached to requests as `Authorization: Bearer <token>`.
- Protected routes on the backend require sending the token; the dev proxy ensures calls to `/api/...` hit the backend server.

