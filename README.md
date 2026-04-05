# AI Business Planner

Production-ready SaaS starter built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB, Mongoose, Redis, and Groq or Gemini for AI-powered business plan generation.

## Features

- JWT authentication with secure password hashing
- Personalized AI business plan generator
- 30-day roadmap with task progress tracking
- MongoDB persistence with indexed Mongoose schemas
- Redis caching and Redis-backed rate limiting fallback support
- AI follow-up chat assistant
- Market demand indicator based on keyword logic
- PDF export endpoint
- Responsive dashboard with dark/light mode
- SSR-friendly architecture with lazy loading and lean API boundaries

## Tech stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Next.js Route Handlers for backend APIs
- MongoDB + Mongoose
- Redis + ioredis
- Groq API or Gemini API

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the required values.

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-business-planner
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=use-a-long-random-secret-at-least-32-characters
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-key
GEMINI_API_KEY=your-gemini-key
```

## Local development

1. Install dependencies with `npm install`.
2. Start MongoDB and Redis locally, or point the environment variables to managed services.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Recommended production setup

- Deploy Next.js on Vercel, Fly.io, Railway, or another Node-compatible platform.
- Use MongoDB Atlas for the database.
- Use Upstash Redis or Redis Cloud for low-latency caching and rate limiting.
- Store secrets in environment variables only.
- Enable CDN caching for static assets.

## Folder structure

```text
app/
  (auth)/
  api/
  dashboard/
components/
  dashboard/
  forms/
  layout/
  providers/
  shared/
lib/
  ai/
  auth/
  cache/
  db/
  validation/
models/
styles/
types/
```

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/plans`
- `POST /api/plans/generate`
- `GET /api/plans/:id`
- `PATCH /api/plans/:id`
- `DELETE /api/plans/:id`
- `POST /api/plans/:id/chat`
- `GET /api/plans/:id/export`

## Performance notes

- Server components render dashboard data on the server.
- Redis caches repeated generation requests for matching inputs.
- Dynamic import is used for plan preview UI.
- Mongoose queries use `lean()` where appropriate.
- API routes keep payloads narrow to minimize response size.
- Tailwind CSS keeps styling output compact and CDN-friendly.

## Security notes

- Zod validation on auth, planner, and chat inputs
- Sanitized text fields before persistence
- HTTP-only JWT cookies
- Bcrypt password hashing
- Route-level auth guards
- Rate limiting backed by Redis with in-memory fallback
- API keys are read only from server-side environment variables
