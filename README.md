
# Lumi — Intelligent Student Wellness & Productivity Ecosystem

Lumi is a full-stack, AI-integrated wellness companion engineered to solve the burnout cycle common in high-pressure academic environments. Built with Next.js 16, React 19, and Prisma 7, it utilizes a context-aware recommendation engine to synchronize academic performance with physiological recovery.

> "Feel Better. Study Better. Live Better."

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | High-performance React framework with integrated API routes. |
| **React 19 + Vite** | Ultra-fast UI rendering with the latest React Compiler. |
| **Tailwind CSS v4** | Aesthetic styling with OKLch color space for soft, professional gradients. |
| **PostgreSQL + Prisma 7** | Relational data persistence with a type-safe ORM layer. |
| **Google Gemini API** | Predictive AI insights and contextual wellness recommendations. |

---

## Core Features

### Central Wellness Dashboard
A unified command center calculating a real-time **Wellness Index**. It correlates cognitive load (study hours) with biological recovery (sleep/nutrition) to provide a holistic view of health.

### Focus Room and Cognitive Analytics
Subject-specific study tracking with integrated Pomodoro timers. Features **Burnout Detection** algorithms that monitor session density to suggest optimal break windows.

### AI Life Organizer (Gap Logic)
A sophisticated planner that parses academic schedules to identify "free blocks," automatically suggesting time for meals, hydration, and movement based on the user's workload.

### Dreamy Sleep and Recovery
Visualizes sleep quality and consistency using moon-inspired gradients. Provides AI-driven suggestions to optimize Circadian rhythms during high-stress exam periods.

---

## Project Structure

```text
Lumi/
├── lumi-frontend/           # Vite + React (UI Layer)
│   ├── src/components/      # Glassmorphic UI components
│   └── src/pages/           # Dashboard, Study, Health pages
└── lumi-backend/            # Next.js (API & AI Layer)
    ├── prisma/              # Database schema & migrations
    ├── src/app/api/         # CRUD & AI endpoints
    └── src/services/        # Gemini AI & Wellness logic

```

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL (Local or Neon.tech)
- Gemini API Key (Google AI Studio)

### 2. Initial Setup

```bash
# Clone and Install Backend
cd lumi-backend
npm install
npx prisma init

# Clone and Install Frontend
cd ../lumi-frontend
npm install
```

### 3. Environment Variables (.env)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/lumi"
GEMINI_API_KEY="your_api_key_here"
```

---




