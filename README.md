# 🛡️ Vigilance — AI-Powered Crime Intelligence Platform

**Vigilance** is a real-time crime intelligence and threat monitoring dashboard built for law enforcement agencies. It leverages AI-driven analysis to process phone call records, SMS intercepts, and crime alerts — empowering officers with actionable insights for faster response and smarter policing.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Edge Functions](#-edge-functions)
- [Authentication](#-authentication)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🗺️ Interactive Crime Map
- Real-time geospatial visualization of crime alerts across Delhi NCR using **Leaflet**
- Color-coded markers by risk level (Critical, High, Medium, Low)
- Click-to-inspect alert details with location, crime type, and AI analysis

### 🚨 Live Alert Management
- Real-time alert feed powered by **Supabase Realtime** subscriptions
- Alert cards with risk-level badges, crime type classification, and status tracking
- Detailed alert view with AI-generated analysis, assigned officer/station info
- Status workflow: `active` → `investigating` → `resolved` → `closed`

### 📊 Interactive Statistics Dashboard
- **Threats Today** — Clickable popover showing breakdown by crime type
- **Calls Monitored** — Summary of total vs. flagged calls with recent flagged snippets
- **SMS Monitored** — Total vs. flagged SMS with suspicious message previews
- **Active/Resolved Alerts** — Quick-access list of the 5 most recent alerts

### 📞 Records Table
- Tabbed view for **Call Records** and **SMS Records**
- Columns: Phone number, caller/sender name, status, location, timestamp
- Risk badges for flagged records; clean status labels for safe records
- Transcript/message preview for quick scanning

### 🤖 Vigilance AI Chat (VigiBot)
- AI-powered crime intelligence assistant accessible via a **medium dialog popup**
- Powered by **Google Gemini 3 Flash** via edge function with streaming responses
- Capabilities:
  - Crime pattern analysis and threat assessment
  - Active alert summarization with risk levels
  - Tactical recommendations for investigations
  - Call transcript and SMS analysis for criminal intent detection
  - Resource deployment and patrol route suggestions
- Markdown-rendered responses with real-time streaming

### 🔐 Authentication & Security
- Email/password authentication via Supabase Auth
- Protected routes with automatic redirect to login
- Officer profiles with badge number, rank, and station assignment
- Auto-profile creation on signup via database trigger
- Row-Level Security (RLS) on all tables

### 📱 Responsive Design
- **Desktop**: Full grid layout with map, alerts, stats, records, and AI chat button
- **Mobile**: Tabbed bottom navigation (`Map`, `Alerts`, `Data`, `AI`) for optimal mobile UX
- Dark theme optimized for operational environments

### 📈 Threat Distribution Chart
- Visual breakdown of crime types using **Recharts** bar/pie charts
- Dynamic data from live alert feed

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  React + TypeScript + Tailwind CSS + shadcn/ui  │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Crime Map │ │  Alerts  │ │  Records Table   │ │
│  │ (Leaflet)│ │  (Live)  │ │ (Calls + SMS)    │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │Stats Bar │ │ Threat   │ │  AI Chat Dialog  │ │
│  │(Popover) │ │  Chart   │ │  (Streaming)     │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│                Supabase Backend                  │
│                                                  │
│  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL   │  │   Edge Functions        │  │
│  │  - alerts     │  │   - vigibot-chat        │  │
│  │  - call_recs  │  │     (Gemini AI)         │  │
│  │  - sms_recs   │  │                         │  │
│  │  - profiles   │  └─────────────────────────┘  │
│  │  - stations   │                               │
│  └──────────────┘  ┌─────────────────────────┐  │
│                     │   Realtime              │  │
│  ┌──────────────┐  │   - alerts subscription  │  │
│  │  Auth         │  └─────────────────────────┘  │
│  │  - Email/Pass │                               │
│  └──────────────┘                                │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer        | Technology                                      |
|-------------|--------------------------------------------------|
| **Frontend** | React 18, TypeScript 5, Vite 5                  |
| **Styling**  | Tailwind CSS 3, shadcn/ui, Framer Motion         |
| **Maps**     | Leaflet, React-Leaflet                           |
| **Charts**   | Recharts                                         |
| **State**    | TanStack React Query, React Context              |
| **Backend**  | Supabase (PostgreSQL, Auth, Realtime, Edge Fn)   |
| **AI**       | Google Gemini 3 Flash (via Edge Function)         |
| **Testing**  | Vitest, Testing Library                          |

---

## 🗄️ Database Schema

### `alerts`
| Column              | Type      | Description                          |
|--------------------|-----------|--------------------------------------|
| `id`               | UUID (PK) | Unique alert identifier              |
| `alert_code`       | text      | Human-readable alert code            |
| `crime_type`       | text      | Classification (e.g., Extortion)     |
| `risk_level`       | text      | CRITICAL / HIGH / MEDIUM / LOW       |
| `status`           | text      | active / investigating / resolved    |
| `summary`          | text      | Brief description of the threat      |
| `ai_analysis`      | text      | AI-generated threat analysis         |
| `phone_number`     | text      | Associated phone number              |
| `source`           | text      | Data source (CALL / SMS)             |
| `lat` / `lng`      | float     | Geolocation coordinates              |
| `location_address` | text      | Human-readable address               |
| `assigned_officer_id` | UUID   | FK to officer profile                |
| `assigned_station_id` | UUID   | FK to `police_stations`              |

### `call_records`
| Column            | Type      | Description                        |
|------------------|-----------|-------------------------------------|
| `id`             | UUID (PK) | Unique record identifier            |
| `phone_number`   | text      | Monitored phone number              |
| `caller_name`    | text      | Name of the caller                  |
| `status`         | text      | flagged / clean / monitoring        |
| `transcript`     | text      | Call transcript content             |
| `duration`       | text      | Call duration                       |
| `lat` / `lng`    | float     | Geolocation of the call             |
| `location_address` | text    | Address of the call origin          |

### `sms_records`
| Column            | Type      | Description                        |
|------------------|-----------|-------------------------------------|
| `id`             | UUID (PK) | Unique record identifier            |
| `phone_number`   | text      | Monitored phone number              |
| `sender_name`    | text      | Name of the sender                  |
| `message`        | text      | SMS content                         |
| `status`         | text      | flagged / clean / monitoring        |
| `lat` / `lng`    | float     | Geolocation                         |
| `location_address` | text    | Address                             |

### `profiles`
| Column         | Type      | Description                          |
|---------------|-----------|--------------------------------------|
| `id`          | UUID (PK) | Profile identifier                   |
| `user_id`     | UUID      | References `auth.users`              |
| `full_name`   | text      | Officer's full name                  |
| `badge_number`| text      | Badge/ID number                      |
| `rank`        | text      | Officer rank                         |
| `station`     | text      | Assigned police station              |

### `police_stations`
| Column     | Type      | Description                            |
|-----------|-----------|----------------------------------------|
| `id`      | UUID (PK) | Station identifier                     |
| `name`    | text      | Station name                           |
| `address` | text      | Physical address                       |
| `contact` | text      | Contact number                         |
| `lat`/`lng`| float    | Station coordinates                    |
| `officers`| int       | Number of officers assigned            |

---

## 📁 Project Structure

```
vigilance/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIChatPanel.tsx       # Vigilance AI chat with streaming
│   │   │   ├── AlertDetail.tsx       # Detailed alert view
│   │   │   ├── AlertList.tsx         # Real-time alert feed
│   │   │   ├── CrimeMap.tsx          # Leaflet crime map
│   │   │   ├── Header.tsx            # App header with branding
│   │   │   ├── RecordsTable.tsx      # Call/SMS records table
│   │   │   ├── StatsBar.tsx          # Interactive statistics cards
│   │   │   └── ThreatChart.tsx       # Crime type distribution chart
│   │   └── ui/                       # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx           # Authentication context provider
│   ├── data/
│   │   └── mockData.ts              # Fallback mock data
│   ├── hooks/
│   │   ├── useAlerts.ts             # Alert data hook with realtime
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   └── use-toast.ts            # Toast notification hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client (auto-generated)
│   │       └── types.ts             # Database types (auto-generated)
│   ├── pages/
│   │   ├── Auth.tsx                 # Login/Signup page
│   │   ├── Index.tsx                # Main dashboard page
│   │   └── NotFound.tsx             # 404 page
│   ├── App.tsx                      # Root app with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles & design tokens
├── supabase/
│   ├── functions/
│   │   └── vigibot-chat/
│   │       └── index.ts             # AI chat edge function
│   └── config.toml                  # Supabase configuration
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun** package manager
- **Supabase** project (for backend services)

### Installation

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd vigilance

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm run test          # Single run
npm run test:watch    # Watch mode
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

For the AI chat edge function, configure these secrets in your Supabase project:

| Secret            | Description                              |
|-------------------|------------------------------------------|
| `LOVABLE_API_KEY` | API key for AI gateway (Gemini access)   |

---

## ⚡ Edge Functions

### `vigibot-chat`

AI-powered crime intelligence chatbot using Google Gemini 3 Flash.

- **Endpoint**: `POST /functions/v1/vigibot-chat`
- **Request Body**: `{ "messages": [{ "role": "user", "content": "..." }] }`
- **Response**: Server-Sent Events (SSE) stream
- **Features**: Streaming responses, rate limiting (429), usage limits (402)

---

## 🔐 Authentication

Vigilance uses **Supabase Auth** with email/password authentication:

1. **Sign Up**: Officers register with full name, email, and password
2. **Email Verification**: Users must verify their email before accessing the dashboard
3. **Auto Profile**: A database trigger automatically creates an officer profile on signup
4. **Protected Routes**: All dashboard routes require authentication
5. **Session Persistence**: Sessions are stored in localStorage with auto-refresh

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software developed for law enforcement use. All rights reserved.

---

<p align="center">
  <strong>🛡️ Vigilance</strong> — Smarter Policing Through Intelligence
</p>
