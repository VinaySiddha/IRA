# Database Schema

## Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'author',
  institution VARCHAR(255),
  bio TEXT,
  expertise TEXT,
  orcid_id VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

## Categories

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Papers

```sql
CREATE TABLE papers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  corresponding_email VARCHAR(150) NOT NULL,
  pdf_url TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  doi VARCHAR(100) UNIQUE,
  citation_text TEXT,
  published_at TIMESTAMP
);

CREATE INDEX idx_papers_status ON papers(status);
CREATE INDEX idx_papers_category ON papers(category_id);
CREATE INDEX idx_papers_submitted_by ON papers(submitted_by);
```

## Paper Authors (multi-author support)

```sql
CREATE TABLE paper_authors (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150) NOT NULL,
  affiliation VARCHAR(255),
  author_order INTEGER NOT NULL DEFAULT 1,
  is_corresponding BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_paper_authors_paper ON paper_authors(paper_id);
CREATE INDEX idx_paper_authors_user ON paper_authors(user_id);
```

## Volumes

```sql
CREATE TABLE volumes (
  id SERIAL PRIMARY KEY,
  volume_number INTEGER NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Issues

```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  volume_id INTEGER REFERENCES volumes(id) ON DELETE CASCADE,
  issue_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  published_at TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(volume_id, issue_number)
);

CREATE INDEX idx_issues_volume ON issues(volume_id);
```

## Paper Issues (assigning papers to issues)

```sql
CREATE TABLE paper_issues (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
  issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
  page_start INTEGER,
  page_end INTEGER,
  order_in_issue INTEGER,
  UNIQUE(paper_id, issue_id)
);
```

## Reviews

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  comments TEXT,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  recommendation VARCHAR(50),
  status VARCHAR(30) DEFAULT 'pending',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_paper ON reviews(paper_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_status ON reviews(status);
```

## Editorial Decisions

```sql
CREATE TABLE editorial_decisions (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER REFERENCES papers(id) ON DELETE CASCADE,
  editor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  decision VARCHAR(50) NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decisions_paper ON editorial_decisions(paper_id);
```

## Notifications

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  notification_type VARCHAR(50),
  reference_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

## Audit Log

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
```

## Enums Reference

### User Roles
- `author`
- `reviewer`
- `editor`
- `admin`

### Paper Status
- `submitted`
- `under_review`
- `revision_requested`
- `revised`
- `accepted`
- `rejected`
- `published`

### Review Status
- `pending`
- `in_progress`
- `completed`
- `declined`

### Review Recommendations
- `accept`
- `minor_revision`
- `major_revision`
- `reject`

### Editorial Decisions
- `accept`
- `minor_revision`
- `major_revision`
- `reject`

### Notification Types
- `submission_received`
- `review_assigned`
- `review_completed`
- `decision_made`
- `paper_published`
