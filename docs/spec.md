# spec.md

## Research Paper Publishing Platform Specification

### 1. Project Overview

The system is a web-based platform that allows researchers to submit, review, and publish academic papers. It provides structured workflows for authors, reviewers, editors, and administrators. The system organizes publications into volumes and issues similar to academic journals.

Primary goals:

* Provide a reliable platform for paper submission and publication
* Enable structured peer review workflows
* Maintain searchable archives of published papers
* Support scalable cloud infrastructure for storing and delivering research content

---

## 2. User Roles

### Author

Capabilities:

* Register and login
* Submit research papers
* Upload revised versions
* Track submission status
* View reviewer feedback

### Reviewer

Capabilities:

* Access assigned papers
* Download manuscripts
* Submit review comments
* Provide recommendation decisions

### Editor

Capabilities:

* View submissions
* Assign reviewers
* Request revisions
* Accept or reject papers
* Assign papers to journal issues

### Administrator

Capabilities:

* Manage users
* Manage editorial board
* Create volumes and issues
* Publish accepted papers
* Monitor system activity

---

## 3. Core Functional Modules

### Authentication System

The platform must support secure authentication.

Features:

* User registration
* Login/logout
* Role-based access control
* Password hashing
* Session management

---

### Paper Submission System

Authors can upload research papers through a structured form.

Required metadata:

* Paper title
* Abstract
* Keywords
* Author names
* Affiliations
* Corresponding author email
* Research category
* PDF file upload

The system must validate:

* PDF format
* File size limits
* Required fields

---

### Peer Review System

After submission, papers enter the peer review workflow.

Workflow:

```
Submission
↓
Editor screening
↓
Reviewer assignment
↓
Reviewer feedback
↓
Editorial decision
```

Reviewers must provide:

* Evaluation scores
* Written comments
* Final recommendation

Possible recommendations:

* Accept
* Minor revision
* Major revision
* Reject

---

### Publication Management

Accepted papers are assigned to journal issues.

Structure:

```
Journal
  └ Volume
      └ Issue
          └ Paper
```

Each published paper must include:

* DOI identifier
* Citation format
* Downloadable PDF
* Metadata for indexing

---

### Paper Archive

Published papers must be organized in a searchable archive.

Archive navigation:

* By year
* By volume
* By issue
* By research field

Search filters:

* Author name
* Keywords
* Title
* Publication year

---

### Paper Display Page

Each paper must have a dedicated public page.

Content:

* Paper title
* Author list
* Abstract
* Keywords
* Download PDF
* Citation format
* DOI

---

### File Storage

All research PDFs are stored in cloud storage.

Requirements:

* Secure storage
* High availability
* Scalable capacity
* Public access for published papers

---

### Administration Panel

The admin panel allows management of journal operations.

Functions:

* User management
* Reviewer assignment
* Paper moderation
* Issue creation
* Publication approval

---

## 4. Non-Functional Requirements

### Performance

* API responses < 500 ms
* File uploads handled asynchronously

### Security

* HTTPS only
* Secure authentication
* Input validation
* File type verification

### Scalability

System must support:

* Thousands of users
* Large file storage
* Growing archives

---

## 5. Technology Stack

Frontend:

* React
* Tailwind CSS

Backend:

* Django REST API

Database:

* PostgreSQL

Cloud Infrastructure:

* Google Cloud Run
* Cloud SQL
* Cloud Storage

---



# implementation.md

## Implementation Guide

### Phase 1 — Project Setup

1. Create repository
2. Setup backend project
3. Setup frontend project
4. Configure Google Cloud project

---

## Phase 2 — Backend Development

Create Django project.

Modules:

```
users
papers
reviews
journal
```

Key models:

User
Paper
Review
Volume
Issue

Database must run on PostgreSQL.

---

## Phase 3 — Authentication System

Implement:

* user registration
* login
* JWT authentication
* role-based permissions

Users must have roles:

```
author
reviewer
editor
admin
```

---

## Phase 4 — Paper Submission Module

Steps:

1. Create submission API
2. Store metadata in database
3. Upload PDF to cloud storage
4. Assign submission status

Status values:

```
submitted
under_review
accepted
rejected
published
```

---

## Phase 5 — Review System

Editors assign reviewers.

Reviewers submit:

* comments
* evaluation score
* recommendation

Editor decision logic:

```
If majority accept → Accept
If revisions required → Request revision
If majority reject → Reject
```

---

## Phase 6 — Publication System

Accepted papers are assigned to journal issues.

Process:

```
Create Volume
Create Issue
Assign Paper
Publish Paper
```

Published papers become publicly visible.

---

## Phase 7 — Frontend Development

Frontend pages:

```
Home
Submit Paper
Paper Archive
Paper Details
Login
Dashboard
```

Dashboard changes based on role.

Author dashboard:

* submissions
* status tracking

Reviewer dashboard:

* assigned papers

Editor dashboard:

* moderation tools

---

## Phase 8 — Deployment on Google Cloud

Infrastructure:

```
Frontend → Firebase Hosting
Backend → Cloud Run
Database → Cloud SQL
Files → Cloud Storage
```

Deployment steps:

1. Containerize backend
2. Deploy to Cloud Run
3. Configure database connection
4. Configure storage bucket
5. Setup domain

---

## Phase 9 — Monitoring and Maintenance

Enable:

* cloud logging
* error monitoring
* system health checks

Regular tasks:

* database backups
* storage monitoring
* security updates

---

## Final System Workflow

```
Author submits paper
↓
Editor screens submission
↓
Reviewer evaluates manuscript
↓
Editor decision
↓
Accepted papers assigned to issue
↓
Paper published
```

---

If needed, the next step can be creating **two additional documents used in large engineering projects**:

* **system-design.md** (full architecture diagrams)
* **database-schema.md** (complete SQL schema)

These make the platform easier to scale and maintain.
