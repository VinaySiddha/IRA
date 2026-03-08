# IRA - International Research Archive

## Project Overview
Academic research paper publishing platform with peer review workflow.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS v4 (no UI libraries)
- **Backend**: Django REST Framework + SimpleJWT
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Storage**: Local (dev) / Google Cloud Storage (prod)

## Project Structure
```
IRA/
  backend/       # Django REST API
    ira/         # Django project settings
    users/       # Auth, profiles, permissions
    papers/      # Paper submission, categories
    reviews/     # Peer review, editorial decisions
    journal/     # Volumes, issues, publication
  frontend/      # React SPA
    src/
      components/  # Reusable UI components
      pages/       # Route pages
      services/    # API client functions
      context/     # React context providers
      hooks/       # Custom hooks
  docs/          # Project documentation
```

## Commands
- Backend: `cd backend && venv/Scripts/activate && python manage.py runserver`
- Frontend: `cd frontend && npm run dev`
- Migrations: `cd backend && python manage.py makemigrations && python manage.py migrate`

## Conventions
- API prefix: `/api/v1/`
- Response format: `{ "status": "success/error", "data": {} }`
- Commit messages: `type: description` (feat/fix/refactor/docs)
- Component files: PascalCase.jsx
- Service files: camelCase.js
- Python: snake_case, Django conventions

## Design System
- Colors: Primary #1867C0, Secondary #48A9A6, DevFest-inspired palette
- Font: Inter
- Style: Glass-morphism navbar, gradient CTAs, card-based layouts, framer-motion animations
