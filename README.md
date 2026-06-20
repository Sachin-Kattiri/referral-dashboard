# Go Business — Referral Dashboard

A referral management dashboard built with React + Vite. Users sign in, then view
overview metrics, a service summary, their referral link/code, and a searchable,
sortable, paginated table of referrals with a detail view per referral.

## Tech stack

- React 19 + Vite
- react-router-dom (client-side routing)
- js-cookie (jwt_token cookie storage)
- Plain CSS (no UI framework)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
npm run lint        # ESLint
```

## Test credentials

```
Email:    admin@example.com
Password: admin123
```

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx          # Brand link, Home nav, Log out
│   ├── Footer.jsx          # Footer brand, About/Privacy links, copyright
│   └── ProtectedRoute.jsx  # Redirects to /login when jwt_token cookie is absent
├── pages/
│   ├── Login.jsx           # Email/password sign-in form
│   ├── Dashboard.jsx       # Overview, service summary, share referral, referrals table
│   ├── ReferralDetail.jsx  # /referral/:id detail view
│   └── NotFound.jsx        # 404 page, reachable without auth
├── utils/
│   ├── api.js               # loginRequest() and fetchReferrals() — all network calls
│   └── format.js             # formatDate() and formatProfit() display helpers
├── App.jsx                  # <BrowserRouter> + <Routes> (all routes defined here)
├── main.jsx                  # Renders <App /> only — no router here
└── index.css                  # Global styles / design tokens
```

## Routing

| Route                  | Access    | Notes                                      |
|-------------------------|-----------|---------------------------------------------|
| `/login`                | Public    | Redirects to `/` if already authenticated  |
| `/`                     | Protected | Referral Dashboard                          |
| `/referral/:id`         | Protected | Single referral detail                      |
| `/dashboard/referrals`  | Public    | Redirects to `/`                            |
| `*`                     | Public    | 404 — intentionally **not** wrapped in `ProtectedRoute` |

Auth is cookie-based: `ProtectedRoute` checks `Cookies.get('jwt_token')` and redirects
to `/login` when it's missing.

## API integration

All calls live in `src/utils/api.js`.

- **Sign in:** `POST /api/auth/signin` with `{ email, password }`. On success the JWT
  at `responseJson.data.token` is stored via `Cookies.set('jwt_token', token)`. On
  failure, `responseJson.message` is shown on the login page.
- **Referrals:** `GET /api/referrals` with optional `search`, `sort` (`asc`/`desc`,
  default `desc`), and `id` query params, sent with `Authorization: Bearer <jwt_token>`.
  The API returns the full (filtered/sorted) result set — pagination (10 rows/page) is
  handled entirely client-side in `Dashboard.jsx`.
- **Referral detail:** same endpoint with `?id=<id>`. The response's `data` may be the
  referral row itself, or an object containing a `referrals` array — both shapes are
  handled in `ReferralDetail.jsx`.

## Formatting

- Dates: API's `YYYY-MM-DD` → displayed as `YYYY/MM/DD`.
- Profit: formatted as USD with no decimal digits (`Intl.NumberFormat`, e.g. `$1,234`).

## Accessibility notes

- Form labels are wired to inputs via `htmlFor`/`id`.
- Landmark `aria-label`s on the Overview, Service summary, and Share referral sections,
  and on the primary nav (`Primary`) and footer nav (`Footer`).
- The dashboard error message uses `role="alert"` so screen readers announce failures.
- Table rows are keyboard-activatable (`tabIndex`, `Enter`/`Space`) in addition to click.

## Deployment

Deployed on Vercel as a standard Vite SPA. Build command: `npm run build`. Output
directory: `dist`. Because this is a client-side-routed SPA, Vercel's default rewrite
to `index.html` handles deep links like `/referral/5` correctly.
