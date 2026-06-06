# Limu

> A full-stack AI wellness companion for college students — tracking sleep, study, nutrition, activity and schedule, with a personalised AI chat powered by OpenAI.

---

## Getting Started

### 1. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/limu
JWT_SECRET=<any_long_random_string>
OPENAI_API_KEY=sk-proj-...       # optional — AI features only
```

### 2. Install and run

```bash
# Terminal 1 — API
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173**

---

## Project Structure

```
limu/
├── backend/
│   ├── server.js                 Entry point — Express app, middleware, routes
│   ├── config/
│   │   └── db.js                 MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               JWT verification
│   │   └── errorHandler.js       Centralised error responses
│   ├── models/                   Mongoose schemas with indexes + validation
│   │   ├── User.js
│   │   ├── StudySession.js
│   │   ├── SleepLog.js
│   │   ├── MealLog.js
│   │   ├── ActivityLog.js
│   │   └── ScheduleEvent.js
│   ├── services/                 Business logic, isolated from HTTP layer
│   │   ├── auth.service.js
│   │   ├── study.service.js
│   │   ├── sleep.service.js
│   │   ├── nutrition.service.js
│   │   ├── activity.service.js
│   │   ├── schedule.service.js
│   │   ├── dashboard.service.js
│   │   └── ai.service.js         OpenAI: chat, contextual chat, food lookup, insights
│   ├── controllers/              HTTP layer — parse request, call service, send response
│   │   ├── auth.controller.js
│   │   ├── study.controller.js
│   │   ├── sleep.controller.js
│   │   ├── nutrition.controller.js
│   │   ├── activity.controller.js
│   │   ├── schedule.controller.js
│   │   ├── chat.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/                   Express routers
│   └── utils/
│       └── response.js           ok() / fail() helpers
│
└── frontend/
    ├── vite.config.js            Dev server + /api proxy
    └── src/
        ├── api/                  Axios wrappers, one file per resource
        ├── hooks/
        │   └── useApi.js         useApi + useMutation — consistent data fetching
        ├── context/
        │   └── AppContext.jsx    Auth state, theme, user object
        ├── components/
        │   ├── Limu/             SVG ghost mascot
        │   ├── LandingSequence/  Animated intro
        │   ├── Sidebar/          Left nav (desktop) + tab bar (mobile)
        │   └── ChatWidget/       Floating AI chat bubble (all pages)
        └── pages/
            ├── Landing/          Auth — register / login
            ├── Dashboard/        Wellness overview + mood
            ├── Study/            Pomodoro timer + session log
            ├── Sleep/            Sleep log + weekly chart
            ├── Nutrition/        Meal log + AI food lookup + macros
            ├── Activity/         Activity rings + log
            ├── Schedule/         Daily timeline + event CRUD
            └── Chat/             Full-page contextual AI chat
```

## API Reference

| Method | Route                     | Auth | Description                      |
|--------|---------------------------|------|----------------------------------|
| POST   | /api/auth/register        | –    | Create account                   |
| POST   | /api/auth/login           | –    | Login, returns JWT               |
| GET    | /api/auth/me              | ✓    | Current user                     |
| PATCH  | /api/auth/goals           | ✓    | Update daily goals               |
| GET    | /api/dashboard            | ✓    | Aggregated stats + AI insight    |
| GET    | /api/study                | ✓    | Today's sessions                 |
| POST   | /api/study                | ✓    | Log a session                    |
| GET    | /api/study/totals         | ✓    | Subject totals (today)           |
| GET    | /api/sleep                | ✓    | Sleep logs                       |
| POST   | /api/sleep                | ✓    | Log sleep                        |
| GET    | /api/sleep/stats          | ✓    | 7-day average + logs             |
| GET    | /api/nutrition            | ✓    | Today's meals                    |
| POST   | /api/nutrition            | ✓    | Log a meal                       |
| POST   | /api/nutrition/lookup     | ✓    | AI food nutrition lookup         |
| DELETE | /api/nutrition/:id        | ✓    | Delete meal                      |
| GET    | /api/activity             | ✓    | Today's activity                 |
| POST   | /api/activity             | ✓    | Log activity                     |
| GET    | /api/schedule             | ✓    | Events for a given date          |
| POST   | /api/schedule             | ✓    | Create event                     |
| PATCH  | /api/schedule/:id         | ✓    | Update event                     |
| DELETE | /api/schedule/:id         | ✓    | Delete event                     |
| POST   | /api/chat                 | ✓    | Simple AI chat (ChatWidget)      |
| POST   | /api/chat/contextual      | ✓    | AI chat with full user context   |
| GET    | /api/chat/insight         | ✓    | AI wellness insight              |

## Tech Stack

| Layer     | Tech                                               |
|-----------|----------------------------------------------------|
| Frontend  | React 18, React Router v6, Vite, Axios, CSS Modules|
| Backend   | Node.js, Express, Helmet, CORS, Morgan             |
| Database  | MongoDB + Mongoose                                 |
| Auth      | JSON Web Tokens + bcryptjs                         |
| AI        | OpenAI GPT-4o mini (graceful fallback if no key)  |
