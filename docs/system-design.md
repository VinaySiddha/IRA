# System Design

## Architecture Overview

```
                    ┌─────────────┐
                    │   Users     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Cloud CDN  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
    ┌─────────▼─────────┐   ┌──────────▼──────────┐
    │  Firebase Hosting  │   │    Load Balancer     │
    │  (React Frontend)  │   │                      │
    └───────────────────┘   └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │     Cloud Run        │
                            │  (Django REST API)   │
                            └───┬──────────────┬───┘
                                │              │
                    ┌───────────▼───┐  ┌───────▼───────────┐
                    │   Cloud SQL   │  │  Cloud Storage     │
                    │ (PostgreSQL)  │  │  (PDF files)       │
                    └───────────────┘  └───────────────────┘
```

## Component Details

### Frontend (React + Tailwind CSS)
- Single page application
- Client-side routing with React Router
- JWT token stored in httpOnly cookies
- API calls via Axios with interceptors for auth
- Responsive design (mobile-first)

### Backend (Django REST Framework)
- RESTful API with versioned endpoints (`/api/v1/`)
- JWT authentication via djangorestframework-simplejwt
- Django apps: `users`, `papers`, `reviews`, `journal`
- Service layer pattern for business logic
- Celery for async tasks (PDF processing, email notifications)

### Database (Cloud SQL - PostgreSQL)
- Primary data store for all structured data
- Connection pooling via PgBouncer
- Automated daily backups
- Read replica for search queries (future)

### File Storage (Cloud Storage)
- PDF manuscripts stored in private buckets
- Signed URLs for authorized downloads
- Public bucket for published paper PDFs
- Max file size: 50MB

## Security

### Authentication Flow
```
Register/Login → JWT access + refresh tokens → Access token in Authorization header → Refresh on expiry
```

### Authorization
- Role-based access control (RBAC)
- Permissions checked at view level via DRF permissions
- Object-level permissions for paper/review ownership

### Data Protection
- HTTPS enforced at load balancer
- Password hashing via Django's PBKDF2
- Input validation at serializer level
- File type verification (PDF only, magic bytes check)
- CORS restricted to frontend domain
- Rate limiting on auth endpoints

## API Request Flow

```
Client Request
    → CORS check
    → Rate limit check
    → JWT authentication
    → Permission check
    → Input validation (serializer)
    → Service layer (business logic)
    → Database query
    → Response serialization
    → JSON response
```

## Caching Strategy

- Django cache framework with Redis
- Cache public paper listings (5 min TTL)
- Cache archive/search results (10 min TTL)
- Cache category list (1 hour TTL)
- Invalidate on write operations

## Email Notifications

Triggered events:
- Paper submitted → author confirmation
- Reviewer assigned → reviewer notification
- Review completed → editor notification
- Decision made → author notification
- Paper published → author notification

## Monitoring

- Google Cloud Logging for application logs
- Google Cloud Monitoring for infrastructure
- Error tracking with structured JSON logs
- Health check endpoint: `GET /api/v1/health`
