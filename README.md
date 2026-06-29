# MediCare Connect — Client

A modern, full-featured healthcare web application that connects patients with verified doctors. Patients can discover specialists, book appointments, pay securely, and leave reviews — while doctors and admins manage their workflows through dedicated dashboards.

**Live Demo:** [medicare-client-gamma.vercel.app](https://medicare-client-gamma.vercel.app)

---

## Overview

MediCare Connect is the frontend of a role-based telehealth platform built for **Programming Hero Assignment 10**. It provides a responsive, accessible UI for three user types — **Patient**, **Doctor**, and **Admin** — each with their own dashboard and protected routes.

The client communicates with a separate Express.js REST API hosted on Render, using JWT-based authentication for protected resources and Better Auth for Google OAuth sign-in.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) (dark / light mode) |
| Auth | JWT (localStorage) + [Better Auth](https://www.better-auth.com/) (Google OAuth) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Features

### Public Pages
- **Home** — Hero section, platform statistics, specializations, and patient reviews
- **Find Doctors** — Search, filter, sort, and paginate verified doctors
- **Doctor Profile** — View doctor details and book appointments
- **Join as Doctor** — Submit a doctor application
- **Login / Register** — Email/password auth and Google OAuth
- **About & Contact** — Static informational pages

### Patient Dashboard
- Overview with upcoming appointments and payment summary
- Book, reschedule, and cancel appointments
- Pay for approved appointments via Stripe Checkout
- View payment history
- Submit and manage doctor reviews

### Doctor Dashboard
- Overview with appointment stats and patient reviews
- Accept or reject appointment requests
- Manage weekly availability schedule
- Write prescriptions and mark appointments as completed
- Edit professional profile

### Admin Dashboard
- Platform analytics (users, doctors, appointments, revenue)
- Manage users (activate / suspend / delete)
- Verify or reject doctor applications
- View all appointments and payment records

---

## Project Structure

```
medicare-client/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes (home, login, doctors, etc.)
│   │   ├── dashboard/         # Role-based dashboards
│   │   │   ├── patient/
│   │   │   ├── doctor/
│   │   │   └── admin/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── join-doctor/
│   │   ├── layout.js
│   │   └── globals.css
│   ├── components/
│   │   └── shared/            # Navbar, Footer, ProtectedRoute
│   ├── lib/
│   │   ├── api.js             # Server URL configuration
│   │   ├── auth-client.js     # Better Auth client instance
│   │   └── wakeup.js          # Render cold-start helper
│   └── services/
│       └── auth/              # Auth API service functions
├── public/
├── next.config.mjs
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running instance of [medicare-server](../medicare-server/) (local or deployed)

### Installation

```bash
# Clone the repository and navigate to the client folder
cd medicare-client

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (no trailing slash) |
| `NEXT_PUBLIC_SERVER_URL` | Alternative fallback for the API base URL |

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Authentication

MediCare Connect uses a dual-auth approach:

1. **Email / Password** — Standard registration and login. The server returns a JWT stored in `localStorage` along with user data.
2. **Google OAuth** — Powered by Better Auth on the server. After Google sign-in, the client exchanges the Better Auth session for a JWT via `POST /api/auth/google`.

Protected dashboard routes are guarded by the `ProtectedRoute` component, which checks for a valid token and the correct user role before rendering content.

---

## API Integration

All API calls use the base URL from `src/lib/api.js`:

```js
import { SERVER_URL, API_BASE_URL } from "@/src/lib/api";
```

Protected requests include the JWT in the `Authorization` header:

```js
headers: {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
}
```

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project on [Vercel](https://vercel.com/).
3. Set the environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-server.onrender.com
   ```
4. Deploy.

> **Note:** The client must point to a live backend. On Render free tier, the server may sleep after inactivity — the app includes a server wake-up helper for Google OAuth flows.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Related Repository

- **Backend API:** [medicare-server](../medicare-server/) — Express.js REST API with MongoDB, Stripe, and Better Auth

---

## License

This project was built as part of **Programming Hero Assignment 10**.
