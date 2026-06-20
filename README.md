# Go Business - Referral Dashboard

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
npm run dev       
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
│   ├── Navbar.jsx          
│   ├── Footer.jsx          
│   └── ProtectedRoute.jsx  
├── pages/
│   ├── Login.jsx           
│   ├── Dashboard.jsx       
│   ├── ReferralDetail.jsx  
│   └── NotFound.jsx        
├── utils/
│   ├── api.js               
│   └── format.js             
├── App.jsx                  
├── main.jsx                  
└── index.css                  
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

