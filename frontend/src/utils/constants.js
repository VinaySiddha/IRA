export const API_URL = 'http://localhost:8000/api/v1';

export const PAPER_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_VERIFIED: 'payment_verified',
  UNDER_REVIEW: 'under_review',
  REVISION_REQUIRED: 'revision_required',
  REVISED: 'revised',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
};

export const PAPER_STATUS_LABELS = {
  [PAPER_STATUSES.DRAFT]: 'Draft',
  [PAPER_STATUSES.SUBMITTED]: 'Submitted',
  [PAPER_STATUSES.PAYMENT_PENDING]: 'Payment Pending',
  [PAPER_STATUSES.PAYMENT_VERIFIED]: 'Payment Verified',
  [PAPER_STATUSES.UNDER_REVIEW]: 'Under Review',
  [PAPER_STATUSES.REVISION_REQUIRED]: 'Revision Required',
  [PAPER_STATUSES.REVISED]: 'Revised',
  [PAPER_STATUSES.ACCEPTED]: 'Accepted',
  [PAPER_STATUSES.REJECTED]: 'Rejected',
  [PAPER_STATUSES.PUBLISHED]: 'Published',
};

export const PAPER_STATUS_VARIANTS = {
  [PAPER_STATUSES.DRAFT]: 'info',
  [PAPER_STATUSES.SUBMITTED]: 'info',
  [PAPER_STATUSES.PAYMENT_PENDING]: 'warning',
  [PAPER_STATUSES.PAYMENT_VERIFIED]: 'success',
  [PAPER_STATUSES.UNDER_REVIEW]: 'warning',
  [PAPER_STATUSES.REVISION_REQUIRED]: 'warning',
  [PAPER_STATUSES.REVISED]: 'info',
  [PAPER_STATUSES.ACCEPTED]: 'success',
  [PAPER_STATUSES.REJECTED]: 'error',
  [PAPER_STATUSES.PUBLISHED]: 'success',
};

export const USER_ROLES = {
  AUTHOR: 'author',
  REVIEWER: 'reviewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
};

