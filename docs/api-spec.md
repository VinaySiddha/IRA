# REST API Specification

Base URL: `/api/v1`

All authenticated endpoints require: `Authorization: Bearer <token>`

Response format:
```json
{ "status": "success", "data": {} }
{ "status": "error", "message": "Error description" }
```

---

## Authentication

### Register
```
POST /api/v1/auth/register
Body: { name, email, password, institution?, bio?, orcid_id? }
Response: { user, access_token, refresh_token }
```

### Login
```
POST /api/v1/auth/login
Body: { email, password }
Response: { user, access_token, refresh_token }
```

### Refresh Token
```
POST /api/v1/auth/refresh
Body: { refresh_token }
Response: { access_token }
```

### Get Profile
```
GET /api/v1/auth/profile
Auth: Required
Response: { user }
```

### Update Profile
```
PUT /api/v1/auth/profile
Auth: Required
Body: { name?, institution?, bio?, expertise?, orcid_id? }
Response: { user }
```

### Change Password
```
PUT /api/v1/auth/change-password
Auth: Required
Body: { old_password, new_password }
```

---

## Papers

### Submit Paper
```
POST /api/v1/papers
Auth: Required (author)
Body: multipart/form-data { title, abstract, keywords, category_id, corresponding_email, pdf_file, authors: [{ name, affiliation, is_corresponding }] }
Response: { paper }
```

### List Papers
```
GET /api/v1/papers?status=&category=&search=&page=&page_size=
Auth: Required
Response: { papers[], pagination }
```

### Get Paper Detail
```
GET /api/v1/papers/{id}
Auth: Required (owner/editor/assigned reviewer) or Public (if published)
Response: { paper, authors, reviews? }
```

### Update Paper
```
PUT /api/v1/papers/{id}
Auth: Required (owner, status must be draft/revision_requested)
Body: multipart/form-data { title?, abstract?, keywords?, pdf_file? }
Response: { paper }
```

### Delete Paper
```
DELETE /api/v1/papers/{id}
Auth: Required (owner, status must be submitted)
```

### Download Paper PDF
```
GET /api/v1/papers/{id}/download
Auth: Public (if published) or Required (owner/editor/reviewer)
Response: PDF file
```

---

## Reviews

### Assign Reviewer
```
POST /api/v1/papers/{paper_id}/reviewers
Auth: Required (editor)
Body: { reviewer_id }
Response: { review }
```

### List Reviews for Paper
```
GET /api/v1/papers/{paper_id}/reviews
Auth: Required (editor/author after decision)
Response: { reviews[] }
```

### Submit Review
```
POST /api/v1/reviews/{review_id}/submit
Auth: Required (assigned reviewer)
Body: { comments, score, recommendation }
Response: { review }
```

### Decline Review
```
POST /api/v1/reviews/{review_id}/decline
Auth: Required (assigned reviewer)
```

### My Review Assignments
```
GET /api/v1/reviews/my-assignments
Auth: Required (reviewer)
Response: { reviews[] }
```

---

## Editorial Decisions

### Make Decision
```
POST /api/v1/papers/{paper_id}/decision
Auth: Required (editor)
Body: { decision, comments }
Response: { editorial_decision, paper }
```

### Decision History
```
GET /api/v1/papers/{paper_id}/decisions
Auth: Required (editor)
Response: { decisions[] }
```

---

## Volumes & Issues

### Create Volume
```
POST /api/v1/volumes
Auth: Required (admin)
Body: { volume_number, year, title? }
Response: { volume }
```

### List Volumes
```
GET /api/v1/volumes
Auth: Public
Response: { volumes[] }
```

### Create Issue
```
POST /api/v1/volumes/{volume_id}/issues
Auth: Required (admin)
Body: { issue_number, title?, description? }
Response: { issue }
```

### List Issues
```
GET /api/v1/volumes/{volume_id}/issues
Auth: Public
Response: { issues[] }
```

### Publish Issue
```
POST /api/v1/issues/{issue_id}/publish
Auth: Required (admin)
Response: { issue }
```

### Assign Paper to Issue
```
POST /api/v1/issues/{issue_id}/papers
Auth: Required (admin)
Body: { paper_id, page_start?, page_end?, order_in_issue? }
Response: { paper_issue }
```

---

## Archive (Public)

### Browse Archive
```
GET /api/v1/archive?year=&volume=&category=&page=
Auth: Public
Response: { papers[], pagination }
```

### Search Papers
```
GET /api/v1/archive/search?q=&author=&keyword=&year=
Auth: Public
Response: { papers[], pagination }
```

---

## Categories

### List Categories
```
GET /api/v1/categories
Auth: Public
Response: { categories[] }
```

### Create Category
```
POST /api/v1/categories
Auth: Required (admin)
Body: { name, description? }
Response: { category }
```

---

## Admin

### List Users
```
GET /api/v1/admin/users?role=&search=&page=
Auth: Required (admin)
Response: { users[], pagination }
```

### Update User Role
```
PUT /api/v1/admin/users/{id}/role
Auth: Required (admin)
Body: { role }
Response: { user }
```

### Dashboard Stats
```
GET /api/v1/admin/stats
Auth: Required (admin)
Response: { total_papers, total_users, pending_reviews, published_papers }
```

---

## Notifications

### List Notifications
```
GET /api/v1/notifications?is_read=&page=
Auth: Required
Response: { notifications[], unread_count, pagination }
```

### Mark as Read
```
PUT /api/v1/notifications/{id}/read
Auth: Required
```

### Mark All as Read
```
PUT /api/v1/notifications/read-all
Auth: Required
```

---

## Pagination

All list endpoints support:
```
?page=1&page_size=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_pages": 5,
    "total_count": 100
  }
}
```
