<p align="center">
  <img src="https://img.icons8.com/fluency/96/internet-of-things.png" alt="IoT Dashboard Logo" width="80"/>
</p>

<h1 align="center">⚡ IoT Dashboard</h1>

<p align="center">
  <strong>Real-time IoT device monitoring, telemetry visualization, and remote hardware control — built with React & TypeScript.</strong>
</p>

<p align="center">
  <a href="https://io-t-dashboard-development-using-re.vercel.app"><img src="https://img.shields.io/badge/🌐_LIVE-io--t--dashboard--development--using--re.vercel.app-00C853?style=for-the-badge" alt="Live Demo"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Anedya-IoT%20Cloud-FF6F00?logoColor=white" alt="Anedya"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/github/license/Ayush-Kumar0207/IoT-Dashboard-Development-using-React?color=blue" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs Welcome"/>
</p>

---

## 🔴 Live Demo

| Resource | URL |
|----------|-----|
| **Dashboard** | [io-t-dashboard-development-using-re.vercel.app](https://io-t-dashboard-development-using-re.vercel.app) |
| **Simulator** | Hosted on [Render](https://render.com) (background service) |
| **Auth Provider** | Supabase (managed) |
| **IoT Platform** | Anedya Cloud — AP-IN-1 Region |

> Register an account on the live site to explore the full dashboard. The simulator on Render continuously pushes temperature & humidity data so charts are always populated.

---

## 📸 Preview

<p align="center">
  <em>Dashboard — Real-time telemetry cards, relay control, and historical sensor trends.</em>
</p>

<!-- Replace with actual screenshots -->
```
┌──────────────────────────────────────────────────────────────────┐
│  ⚡ IoT Admin         │  IoT Device Overview                    │
│                        │                                         │
│  ▸ Overview            │  ┌─────────────┐  ┌─────────────┐      │
│  ▸ User Management     │  │ 🌡 26.4°C   │  │ 💧 58.2%    │      │
│                        │  │ Temperature  │  │ Humidity     │      │
│  ───────────           │  └─────────────┘  └─────────────┘      │
│  User: admin@...       │                                         │
│  ● admin               │  ┌─────────────────────────────────┐   │
│                        │  │ ⚡ Remote Relay Control          │   │
│  [Sign Out]            │  │  ○ ────── ON                    │   │
│                        │  └─────────────────────────────────┘   │
│                        │                                         │
│                        │  ┌─────────────────────────────────┐   │
│                        │  │ 📈 Historical Telemetry          │   │
│                        │  │  ╱╲  ╱╲  ╱╲                    │   │
│                        │  │ ╱  ╲╱  ╲╱  ╲  Temperature     │   │
│                        │  │ ─── Humidity                    │   │
│                        │  └─────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-Kumar0207/IoT-Dashboard-Development-using-React.git
cd IoT-Dashboard-Development-using-React

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# → Fill in your Supabase & Anedya credentials (see Environment Variables below)

# 4. Run the Supabase SQL setup
# → Execute supabase_setup.sql in your Supabase SQL Editor

# 5. Start the development server
npm run dev
# → Open http://localhost:5173
```

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [License](#-license)
- [Author](#-author)

---

## 🧠 About the Project

Modern IoT deployments demand dashboards that are more than static data tables. **IoT Dashboard** bridges the gap between raw sensor telemetry and actionable insight by providing:

- **Live sensor feeds** — Temperature and humidity values streamed every 5 seconds from hardware via the [Anedya IoT Cloud](https://anedya.io) platform.
- **Remote hardware control** — Toggle physical relays directly from the browser with role-based permission gates.
- **Historical trend analysis** — Interactive time-series charts powered by Recharts, auto-refreshing every 15 seconds.
- **Enterprise-grade access control** — Three-tier RBAC (Admin → Operator → Viewer) backed by Supabase Row Level Security, with real-time role sync across sessions.

Whether you're building a smart home prototype, an industrial monitoring console, or a classroom IoT lab, this project provides a production-ready foundation with clean architecture and modern tooling.

---

## ✨ Features

### Real-Time Monitoring
- 🌡️ **Live Temperature & Humidity** — Polled every 5 seconds from the Anedya Cloud API
- 🟢 **Device Online/Offline Detection** — Heartbeat + fallback telemetry timestamp check (3-minute window)
- 📊 **Historical Trend Charts** — Last 1 hour of sensor data rendered as interactive line charts (Recharts)
- 🔄 **Auto-Refresh** — Dashboard data refreshes automatically with configurable intervals

### Device Control
- ⚡ **Remote Relay Toggle** — Send ON/OFF commands to physical hardware from the browser
- 🔐 **Permission-Gated Controls** — Only Admins and Operators can toggle the relay; Viewers see a clear access-restricted notice
- ⏱️ **Command Expiry** — Relay commands auto-expire after 30 seconds for safety

### Authentication & Authorization
- 🔑 **Email/Password Authentication** — Powered by Supabase Auth
- 🛡️ **Three-Tier RBAC** — `ADMIN` · `OPERATOR` · `VIEWER` roles enforced at UI and database levels
- 📡 **Real-Time Role Sync** — Role changes by an Admin are instantly reflected in all user sessions via Supabase Realtime channels
- 🗄️ **Row Level Security** — PostgreSQL RLS policies ensure data integrity at the database layer

### Admin Panel
- 👥 **User Management Table** — View all registered users with role badges and join dates
- 🔄 **Instant Role Updates** — Optimistic UI updates with automatic rollback on failure
- 🚫 **Self-Protection** — Admins cannot modify their own role from the management panel

### User Experience
- 📱 **Fully Responsive** — Desktop sidebar + mobile sheet navigation
- ⚡ **Skeleton Loading States** — Smooth loading indicators across all data-driven components
- 🔔 **Toast Notifications** — Success/error feedback for every user action
- 🎨 **Dark Mode Ready** — CSS variables configured for light and dark themes

---

## 🏗 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript 5.9 | Component architecture & type safety |
| **Build Tool** | Vite 8 | Lightning-fast HMR & optimized builds |
| **Styling** | TailwindCSS 3.4, Radix UI | Utility-first CSS + accessible primitives |
| **State Management** | Zustand 5 | Lightweight global auth state |
| **Data Fetching** | TanStack React Query 5 | Server state, caching, polling |
| **Charts** | Recharts 3 | Responsive, interactive data visualizations |
| **Routing** | React Router 7 | SPA navigation with route guards |
| **Auth & Database** | Supabase (PostgreSQL) | Authentication, RLS, Realtime subscriptions |
| **IoT Platform** | Anedya Cloud (AP-IN-1) | Device telemetry, commands, health status |
| **Deployment** | Vercel (Dashboard), Render (Simulator) | Edge-optimized frontend + always-on backend |
| **Icons** | Lucide React | Consistent, lightweight icon set |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React App (Vite + TypeScript)                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐    │  │
│  │  │ Zustand   │  │ TanStack │  │ React Router         │    │  │
│  │  │ AuthStore │  │ Query    │  │ ProtectedRoute       │    │  │
│  │  │           │  │ Hooks    │  │ RoleRoute             │    │  │
│  │  └─────┬─────┘  └─────┬────┘  └──────────────────────┘    │  │
│  │        │              │                                    │  │
│  └────────┼──────────────┼────────────────────────────────────┘  │
│           │              │                                       │
└───────────┼──────────────┼───────────────────────────────────────┘
            │              │
            ▼              ▼
  ┌──────────────┐   ┌─────────────────┐
  │  Supabase    │   │  Anedya Cloud   │
  │  ──────────  │   │  ─────────────  │
  │  • Auth      │   │  • /data/latest │
  │  • Profiles  │   │  • /data/getData│
  │  • RLS       │   │  • /commands    │
  │  • Realtime  │   │  • /health      │
  └──────────────┘   └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │  IoT Hardware   │
                     │  (or Simulator  │
                     │   on Render)    │
                     └─────────────────┘
```

**Data Flow:**
1. The **Simulator** (hosted on Render) pushes temperature & humidity data to the **Anedya Cloud** via its REST API.
2. The **React dashboard** polls the Anedya Cloud API at configurable intervals (5s telemetry, 10s status, 15s charts).
3. **Supabase** handles user authentication and stores profile/role data with RLS enforcement.
4. **Supabase Realtime** channels ensure role changes propagate instantly to all connected browser sessions.

---

## 📂 Project Structure

```
IoT-Dashboard-Development-using-React/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx   # Auth guard — redirects unauthenticated users
│   │   │   └── RoleRoute.tsx        # RBAC guard — restricts by user role
│   │   ├── dashboard/
│   │   │   ├── HistoricalChart.tsx   # Recharts line chart (temperature + humidity)
│   │   │   ├── RelayControl.tsx     # ON/OFF toggle with permission gating
│   │   │   └── TelemetryCards.tsx   # Live temperature & humidity cards
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx  # Sidebar + mobile sheet + outlet
│   │   └── ui/                      # Radix-based design system (14 components)
│   ├── hooks/
│   │   ├── useIoTData.ts            # TanStack Query hooks for Anedya API
│   │   ├── useAdminUsers.ts         # User management hooks with optimistic updates
│   │   └── use-toast.ts             # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client initialization
│   │   └── utils.ts                 # Utility functions (cn helper)
│   ├── pages/
│   │   ├── Dashboard.tsx            # Main monitoring view
│   │   ├── Admin.tsx                # User management panel (Admin only)
│   │   ├── Login.tsx                # Email/password login
│   │   └── Register.tsx             # Account registration
│   ├── services/
│   │   ├── anedya.ts                # Anedya Cloud API client (telemetry, commands, health)
│   │   └── admin.ts                 # Supabase admin operations (fetch users, update roles)
│   ├── store/
│   │   └── useAuthStore.ts          # Zustand auth + realtime profile sync
│   ├── types/
│   │   └── auth.ts                  # TypeScript types (UserRole, UserProfile)
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Tailwind directives + CSS variables
│   └── App.css                      # Additional styles
├── supabase_setup.sql               # Database schema, RLS policies, triggers
├── vite.config.ts                   # Vite configuration with path aliases
├── tailwind.config.cjs              # Tailwind theme extension
├── vercel.json                      # SPA rewrite rules for Vercel
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies & scripts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# ── Supabase ──────────────────────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# ── Anedya IoT Cloud ──────────────────────────────────
VITE_ANEDYA_API_KEY=your-anedya-project-access-token
VITE_ANEDYA_NODE_ID=your-device-node-id
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (found in Project Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key for client-side access |
| `VITE_ANEDYA_API_KEY` | Anedya project access token (Bearer auth for API calls) |
| `VITE_ANEDYA_NODE_ID` | UUID of the IoT device node registered in your Anedya project |

---

## 🧪 Usage

### Dashboard View
Once logged in, the dashboard displays:
- **Device Status** — Green pulsing indicator when the device (or simulator) is online
- **Telemetry Cards** — Temperature (°C) and Humidity (%) with color-coded thresholds
- **Relay Control** — Toggle switch to send ON/OFF commands (requires Operator or Admin role)
- **Historical Chart** — Line chart showing the last hour of sensor data with auto-refresh

### Admin Panel
Navigate to `/admin` (visible only to Admin users):
- View all registered users in a sortable table
- Change any user's role between `ADMIN`, `OPERATOR`, and `VIEWER` via dropdown
- Role changes take effect immediately across all sessions (Supabase Realtime)

### Role Permissions

| Capability | Admin | Operator | Viewer |
|-----------|:-----:|:--------:|:------:|
| View Dashboard | ✅ | ✅ | ✅ |
| View Telemetry | ✅ | ✅ | ✅ |
| Control Relay | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |

---

## 🚀 Deployment

### Vercel (Frontend)

The dashboard is deployed on Vercel with SPA rewrites configured in `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Steps:**
1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANEDYA_API_KEY`, `VITE_ANEDYA_NODE_ID`)
4. Vercel auto-detects Vite and deploys

### Render (Simulator)

The `simulator.js` background service runs on Render as a **Background Worker** that continuously pushes telemetry data to the Anedya Cloud API — keeping the dashboard populated with live data 24/7.

### Supabase (Database)

1. Create a new Supabase project
2. Navigate to the SQL Editor
3. Paste and execute `supabase_setup.sql` — this creates the `profiles` table, RLS policies, triggers, and backfills existing users
4. Enable **Realtime** on the `profiles` table (Database → Replication → Enable for `profiles`)

---

## 🔒 Security

- **Row Level Security (RLS)** — All database access is governed by PostgreSQL RLS policies. Users can only read their own profile; only Admins can update other users' roles.
- **SECURITY DEFINER Functions** — The `handle_new_user()` trigger function runs with elevated privileges to auto-create profiles on signup.
- **Environment Variables** — All secrets are stored in `.env.local` and never committed to version control.
- **Bearer Token Auth** — Anedya API calls use project access tokens transmitted via `Authorization` headers.
- **Command Expiry** — Relay commands expire after 30 seconds, preventing stale commands from executing on devices.

---

## 🗺 Roadmap

- [ ] 🌙 Dark mode toggle in the UI
- [ ] 📊 Multi-device support (manage multiple nodes from one dashboard)
- [ ] 📈 Customizable time range selectors for historical charts
- [ ] 🔔 Alert thresholds with email/push notifications
- [ ] 📱 PWA support for mobile installation
- [ ] 🧪 Unit & integration tests (Vitest + Testing Library)
- [ ] 📋 Audit log for admin actions
- [ ] 🌐 Multi-language (i18n) support

---

## 🤝 Contributing

Contributions make the open-source community thrive. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

> Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## ❓ FAQ

<details>
<summary><strong>How does the dashboard get data without a real IoT device?</strong></summary>

A `simulator.js` service runs on Render and pushes randomized temperature & humidity values to the Anedya Cloud at regular intervals. The dashboard polls this data exactly like it would from real hardware.
</details>

<details>
<summary><strong>Can I connect a real sensor instead of the simulator?</strong></summary>

Yes. Any device (ESP32, Arduino, Raspberry Pi) that can send HTTP POST requests to the Anedya API with the correct `NODE_ID` and `API_KEY` will work seamlessly. The dashboard is hardware-agnostic.
</details>

<details>
<summary><strong>Why do I see "OFFLINE" even though the simulator is running?</strong></summary>

The dashboard considers a device online if telemetry data was received in the last 3 minutes. If the Render service is sleeping (free tier cold start), it may take a moment to wake up and push data.
</details>

<details>
<summary><strong>How do I become an Admin?</strong></summary>

The first user registers as a `VIEWER` by default. To promote yourself to Admin, run the following in the Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'your@email.com';
```
</details>

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Ayush-Kumar0207">
        <img src="https://github.com/Ayush-Kumar0207.png" width="100px;" alt="Ayush Kumar"/>
        <br />
        <sub><b>Ayush Kumar</b></sub>
      </a>
      <br />
      <a href="mailto:kumarayush70049@gmail.com">📧 Email</a> ·
      <a href="https://github.com/Ayush-Kumar0207">🐙 GitHub</a>
    </td>
  </tr>
</table>

---

## 🌟 Support

If this project helped you or you found it interesting:

- ⭐ **Star this repository** — it helps others discover the project
- 🐛 **Report bugs** via [Issues](https://github.com/Ayush-Kumar0207/IoT-Dashboard-Development-using-React/issues)
- 💡 **Suggest features** via [Discussions](https://github.com/Ayush-Kumar0207/IoT-Dashboard-Development-using-React/discussions)
- 🔀 **Fork & contribute** — PRs are always welcome

---

<p align="center">
  Built with ❤️ using React, Supabase & Anedya IoT Cloud
</p>
