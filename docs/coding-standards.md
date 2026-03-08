# coding-standards.md

## Coding Standards for Research Publishing Platform

### 1. General Principles

All code must follow these principles:

* readability
* maintainability
* modular architecture
* clear naming conventions
* minimal duplication

---

## 2. Repository Structure

Example project structure:

```
project-root
  backend
    users
    papers
    reviews
    journal
  frontend
    components
    pages
    services
  docs
```

Each module must have clearly separated responsibilities.

---

## 3. Naming Conventions

### Variables

Use descriptive names.

Example:

```
paperTitle
reviewRecommendation
authorEmail
```

Avoid abbreviations.

Bad example:

```
pt
revRec
```

---

### Functions

Function names must describe their purpose.

Example:

```
submitPaper()
assignReviewer()
publishPaper()
generateCitation()
```

---

### Database Models

Model names use singular nouns.

Example:

```
User
Paper
Review
Volume
Issue
```

Field names must be clear.

Example:

```
submitted_at
review_status
publication_date
```

---

## 4. API Design Standards

Use RESTful APIs.

Example endpoints:

```
POST /api/auth/register
POST /api/auth/login

POST /api/papers
GET /api/papers
GET /api/papers/{id}

POST /api/reviews
GET /api/reviews/{paper_id}
```

Response format:

```
{
  "status": "success",
  "data": {}
}
```

Error format:

```
{
  "status": "error",
  "message": "Invalid request"
}
```

---

## 5. Backend Coding Guidelines

Backend must follow:

* MVC architecture
* modular service layers
* input validation

Example layers:

```
models
views
services
serializers
```

Business logic must be placed inside service layers.

---

## 6. Security Standards

Mandatory practices:

* password hashing
* input sanitization
* file upload validation
* role-based access control

Never store:

* plain text passwords
* sensitive data in logs

---

## 7. Frontend Standards

React components must be reusable.

Example structure:

```
components
  PaperCard
  SubmissionForm
  ReviewForm
```

Pages must remain lightweight and delegate logic to services.

---

## 8. Version Control Standards

Commit messages must follow structure:

```
type: description
```

Examples:

```
feat: add paper submission endpoint
fix: resolve PDF upload bug
refactor: improve review service logic
```

---