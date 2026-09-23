# DesignLoop — LLD Practice Platform

A focused 2-day MVP for practicing Low-Level Design problems, submitting a structured design, receiving explainable feedback, and reviewing previous attempts.

## Tech stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Persistence: local JSON file (`backend/data/db.json`) for zero-config local development
- Evaluation: deterministic rubric evaluator + optional LLM evaluator
- Tests: Vitest + Supertest
- No database or API key is required for the default demo

## Why this architecture?

This is intentionally a monolith. The assignment explicitly prioritizes LLD/domain design over HLD.

The core domain is separated into:
- Problem
- Attempt
- Submission
- Evaluation
- CriterionResult

Evaluation is behind the `Evaluator` interface, so a deterministic evaluator and an optional AI evaluator can be swapped without changing the practice workflow.

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 9+

## Run locally

### Option A — one command

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Open:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:4000
```

### Option B — separate terminals

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Run tests

From the root:

```bash
npm test
```

or:

```bash
cd backend
npm test
```

## Production build

```bash
npm run build
```

## Optional AI feedback

The application works fully without an API key.

To enable an OpenAI-compatible evaluator:

1. Copy `backend/.env.example` to `backend/.env`.
2. Set:

```env
AI_ENABLED=true
AI_API_KEY=your_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

The AI result is combined with the deterministic evaluation. The deterministic evaluator is always available as the fallback.

For a free/local setup, leave AI disabled.

## Demo flow

1. Open Dashboard.
2. Choose Parking Lot, Elevator, Vending Machine, or Library.
3. Click Start Practice.
4. Fill in requirements, classes, responsibilities, relationships, patterns, decisions, and edge cases.
5. Submit.
6. Watch the attempt move through `SUBMITTED → EVALUATING → COMPLETED`.
7. Review criterion-level evidence, concerns, and suggestions.
8. Click Try Again to create a new attempt.
9. Open History to compare previous attempts.

## Important implementation decisions

### Structured submission

The MVP uses structured text rather than trying to build a full UML editor or code execution sandbox. This gives enough evidence to evaluate LLD quality while keeping the two-day scope realistic.

### Deterministic + AI evaluation

Deterministic checks cover:
- required sections
- evidence of classes
- interfaces/abstraction
- relationships
- patterns/trade-offs
- edge cases

AI is optional for judgment-heavy feedback such as responsibility quality, coupling, cohesion, and extensibility.

### Evaluation failure

The submission is persisted before evaluation begins. If an evaluator fails, the attempt becomes `FAILED` and the learner can retry evaluation without losing the submission.

### Extensibility

`Evaluator` is an interface. New evaluators can be added without rewriting the attempt/submission flow.

### Future submission formats

`Submission` has a `type`, currently `TEXT`. A future `DIAGRAM` or `CODE` submission can be introduced without changing the core attempt lifecycle.

## Project structure

```text
lld-practice-platform/
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   ├── evaluators/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── data/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.ts
│   │   └── App.tsx
│   └── package.json
├── docs/
│   ├── RESEARCH.md
│   └── DESIGN.md
├── AI_USAGE.md
└── package.json
```

## Reset demo data

Delete:

```text
backend/data/db.json
```

and restart the backend. It will recreate the seeded data.

## Notes

This is a focused prototype, not a production deployment. Authentication, multi-user authorization, real database migrations, job queues, and cloud object storage are intentionally outside the MVP scope.
