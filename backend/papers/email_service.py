from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

JOURNAL_NAME = "International Research Archive (IRA)"
SUPPORT_EMAIL = settings.DEFAULT_FROM_EMAIL

def _send(subject, html_body, recipient_list):
    """Send email with error handling."""
    try:
        send_mail(
            subject=subject,
            message='',  # plain text fallback
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_body,
            fail_silently=False,
        )
        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False

def _wrap_html(title, body_content):
    """Wrap content in a styled HTML email template with Google colors."""
    return f'''
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f8f9fa;font-family:'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Google color strip -->
        <div style="height:4px;display:flex;">
          <div style="flex:1;background:#4285F4;"></div>
          <div style="flex:1;background:#EA4335;"></div>
          <div style="flex:1;background:#FBBC04;"></div>
          <div style="flex:1;background:#34A853;"></div>
        </div>
        <!-- Header -->
        <div style="padding:24px 32px;border-bottom:1px solid #e0e0e0;">
          <h1 style="margin:0;font-size:24px;">
            <span style="color:#4285F4;">I</span><span style="color:#EA4335;">R</span><span style="color:#34A853;">A</span>
          </h1>
          <p style="margin:4px 0 0;color:#5f6368;font-size:13px;">International Research Archive</p>
        </div>
        <!-- Content -->
        <div style="padding:32px;">
          <h2 style="color:#202124;font-size:20px;margin:0 0 16px;">{title}</h2>
          {body_content}
        </div>
        <!-- Footer -->
        <div style="padding:20px 32px;background:#f8f9fa;border-top:1px solid #e0e0e0;">
          <p style="margin:0;color:#5f6368;font-size:12px;">
            &copy; 2025 International Research Archive. All rights reserved.<br>
            This is an automated notification. Please do not reply directly to this email.
          </p>
        </div>
        <!-- Bottom color strip -->
        <div style="height:4px;display:flex;">
          <div style="flex:1;background:#4285F4;"></div>
          <div style="flex:1;background:#EA4335;"></div>
          <div style="flex:1;background:#FBBC04;"></div>
          <div style="flex:1;background:#34A853;"></div>
        </div>
      </div>
    </body>
    </html>
    '''

# ─── AUTH EMAILS ───

def send_welcome_email(user):
    """Send welcome email after registration."""
    body = f'''
    <p style="color:#202124;">Dear <strong>{user.name}</strong>,</p>
    <p style="color:#5f6368;">Welcome to the International Research Archive! Your account has been created successfully.</p>
    <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;color:#202124;"><strong>Email:</strong> {user.email}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Role:</strong> {user.role.title()}</p>
      {f'<p style="margin:4px 0;color:#202124;"><strong>Institution:</strong> {user.institution}</p>' if user.institution else ''}
    </div>
    <p style="color:#5f6368;">You can now submit papers, track their progress, and collaborate with researchers worldwide.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Team</p>
    '''
    html = _wrap_html("Welcome to IRA!", body)
    return _send(f"Welcome to {JOURNAL_NAME}", html, [user.email])

# ─── PAPER SUBMISSION EMAILS ───

def send_paper_submitted_email(paper):
    """Send confirmation email when a paper is submitted."""
    authors = ", ".join([a.author_name for a in paper.authors.all()])
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">Your paper has been submitted successfully to IRA.</p>
    <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;color:#202124;"><strong>Title:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{paper.id:04d}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Authors:</strong> {authors or 'Not specified'}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Category:</strong> {paper.category.name if paper.category else 'Uncategorized'}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Status:</strong> <span style="color:#FBBC04;font-weight:bold;">Payment Pending</span></p>
    </div>
    <p style="color:#5f6368;"><strong>Next Step:</strong> Please complete the payment of ₹500 to proceed with the review process.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Team</p>
    '''
    html = _wrap_html("Paper Submitted Successfully", body)
    return _send(f"Paper Submitted: {paper.title} - {JOURNAL_NAME}", html, [paper.submitted_by.email, paper.corresponding_email])

# ─── PAYMENT EMAILS ───

def send_payment_proof_uploaded_email(payment):
    """Notify author that payment proof was received."""
    paper = payment.paper
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">We have received your payment proof for paper <strong>IRA-{paper.id:04d}</strong>.</p>
    <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Transaction ID:</strong> {payment.transaction_id}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Amount:</strong> ₹{payment.amount}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Status:</strong> <span style="color:#4285F4;font-weight:bold;">Under Verification</span></p>
    </div>
    <p style="color:#5f6368;">Our team will verify your payment shortly. You will be notified once it is confirmed.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Team</p>
    '''
    html = _wrap_html("Payment Proof Received", body)
    return _send(f"Payment Proof Received - IRA-{paper.id:04d}", html, [paper.submitted_by.email])

def send_payment_verified_email(payment):
    """Notify author that payment has been verified."""
    paper = payment.paper
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">Great news! Your payment for paper <strong>IRA-{paper.id:04d}</strong> has been <span style="color:#34A853;font-weight:bold;">verified</span>.</p>
    <div style="background:#e8f5e9;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #34A853;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Amount:</strong> ₹{payment.amount}</p>
      <p style="margin:4px 0;color:#34A853;font-weight:bold;">✓ Payment Verified</p>
    </div>
    <p style="color:#5f6368;">Your paper will now be processed and sent for peer review. You will receive updates on its progress.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Team</p>
    '''
    html = _wrap_html("Payment Verified!", body)
    return _send(f"Payment Verified - IRA-{paper.id:04d}", html, [paper.submitted_by.email, paper.corresponding_email])

def send_payment_rejected_email(payment):
    """Notify author that payment was rejected."""
    paper = payment.paper
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">Unfortunately, your payment proof for paper <strong>IRA-{paper.id:04d}</strong> has been <span style="color:#EA4335;font-weight:bold;">rejected</span>.</p>
    <div style="background:#fce8e6;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #EA4335;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      {f'<p style="margin:4px 0;color:#202124;"><strong>Reason:</strong> {payment.notes}</p>' if payment.notes else ''}
    </div>
    <p style="color:#5f6368;">Please upload a valid payment proof to proceed with your submission.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Team</p>
    '''
    html = _wrap_html("Payment Rejected", body)
    return _send(f"Payment Rejected - IRA-{paper.id:04d}", html, [paper.submitted_by.email])

# ─── REVIEW EMAILS ───

def send_reviewer_assigned_email(review):
    """Notify reviewer they have been assigned a paper."""
    body = f'''
    <p style="color:#202124;">Dear <strong>{review.reviewer.name}</strong>,</p>
    <p style="color:#5f6368;">You have been assigned a new paper to review.</p>
    <div style="background:#e8f0fe;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #4285F4;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{review.paper.id:04d}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Title:</strong> {review.paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Category:</strong> {review.paper.category.name if review.paper.category else 'N/A'}</p>
    </div>
    <p style="color:#5f6368;">Please log in to your dashboard to review this paper at your earliest convenience.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Editorial Team</p>
    '''
    html = _wrap_html("New Paper Assigned for Review", body)
    return _send(f"Review Assignment: {review.paper.title}", html, [review.reviewer.email])

def send_review_submitted_email(review):
    """Notify editor that a review has been submitted."""
    from users.models import User
    editors = User.objects.filter(role__in=['editor', 'admin']).values_list('email', flat=True)
    body = f'''
    <p style="color:#202124;">A review has been submitted.</p>
    <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {review.paper.title} (IRA-{review.paper.id:04d})</p>
      <p style="margin:4px 0;color:#202124;"><strong>Reviewer:</strong> {review.reviewer.name}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Recommendation:</strong> {review.recommendation}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Score:</strong> {review.score}/10</p>
    </div>
    <p style="color:#5f6368;">Please log in to the dashboard to make an editorial decision.</p>
    '''
    html = _wrap_html("Review Submitted", body)
    return _send(f"Review Submitted for IRA-{review.paper.id:04d}", html, list(editors))

# ─── DECISION EMAILS ───

def send_paper_accepted_email(paper):
    """Notify author that their paper has been accepted."""
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">Congratulations! Your paper has been <span style="color:#34A853;font-weight:bold;">accepted</span> for publication in the International Research Archive.</p>
    <div style="background:#e8f5e9;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #34A853;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{paper.id:04d}</p>
      <p style="margin:4px 0;color:#34A853;font-weight:bold;">✓ Accepted for Publication</p>
    </div>
    <p style="color:#5f6368;">Your paper will now undergo final formatting and will be published in the upcoming issue.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Editorial Team</p>
    '''
    html = _wrap_html("Paper Accepted!", body)
    return _send(f"Congratulations! Paper Accepted - {paper.title}", html, [paper.submitted_by.email, paper.corresponding_email])

def send_paper_rejected_email(paper, comments=''):
    """Notify author that their paper has been rejected."""
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">We regret to inform you that your paper has not been accepted for publication.</p>
    <div style="background:#fce8e6;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #EA4335;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{paper.id:04d}</p>
      {f'<p style="margin:4px 0;color:#202124;"><strong>Comments:</strong> {comments}</p>' if comments else ''}
    </div>
    <p style="color:#5f6368;">We encourage you to address the reviewer feedback and consider resubmitting.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Editorial Team</p>
    '''
    html = _wrap_html("Paper Decision: Not Accepted", body)
    return _send(f"Paper Decision - {paper.title}", html, [paper.submitted_by.email, paper.corresponding_email])

def send_revision_requested_email(paper, comments=''):
    """Notify author that revisions are requested."""
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">The reviewers have requested revisions to your paper before it can be accepted.</p>
    <div style="background:#fff8e1;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #FBBC04;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{paper.id:04d}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Status:</strong> <span style="color:#FBBC04;font-weight:bold;">Revision Requested</span></p>
      {f'<p style="margin:4px 0;color:#202124;"><strong>Comments:</strong> {comments}</p>' if comments else ''}
    </div>
    <p style="color:#5f6368;">Please revise your paper addressing the reviewer comments and resubmit through your dashboard.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Editorial Team</p>
    '''
    html = _wrap_html("Revision Requested", body)
    return _send(f"Revision Requested - {paper.title}", html, [paper.submitted_by.email, paper.corresponding_email])

def send_paper_published_email(paper):
    """Notify author that their paper has been published."""
    body = f'''
    <p style="color:#202124;">Dear <strong>{paper.submitted_by.name}</strong>,</p>
    <p style="color:#5f6368;">We are pleased to inform you that your paper has been <span style="color:#34A853;font-weight:bold;">published</span> in the International Research Archive!</p>
    <div style="background:#e8f5e9;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #34A853;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{paper.id:04d}</p>
      {f'<p style="margin:4px 0;color:#202124;"><strong>DOI:</strong> {paper.doi}</p>' if paper.doi else ''}
      <p style="margin:4px 0;color:#34A853;font-weight:bold;">✓ Published</p>
    </div>
    <p style="color:#5f6368;">Your paper is now available in the IRA archive for researchers worldwide.</p>
    <p style="color:#5f6368;">Best regards,<br>The IRA Editorial Team</p>
    '''
    html = _wrap_html("Paper Published!", body)
    all_authors = paper.authors.all()
    recipients = [paper.submitted_by.email, paper.corresponding_email]
    for a in all_authors:
        if a.user and a.user.email not in recipients:
            recipients.append(a.user.email)
    return _send(f"Published: {paper.title} - {JOURNAL_NAME}", html, recipients)

# ─── NOTIFICATION FOR EDITORS ───

def send_new_submission_to_editors(paper):
    """Notify all editors about a new paper submission."""
    from users.models import User
    editors = User.objects.filter(role__in=['editor', 'admin']).values_list('email', flat=True)
    if not editors:
        return False
    body = f'''
    <p style="color:#202124;">A new paper has been submitted to IRA.</p>
    <div style="background:#e8f0fe;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #4285F4;">
      <p style="margin:4px 0;color:#202124;"><strong>Title:</strong> {paper.title}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Paper ID:</strong> IRA-{paper.id:04d}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Submitted by:</strong> {paper.submitted_by.name} ({paper.submitted_by.email})</p>
      <p style="margin:4px 0;color:#202124;"><strong>Category:</strong> {paper.category.name if paper.category else 'Uncategorized'}</p>
    </div>
    <p style="color:#5f6368;">Please log in to the dashboard to manage this submission.</p>
    '''
    html = _wrap_html("New Paper Submission", body)
    return _send(f"New Submission: {paper.title}", html, list(editors))

def send_payment_proof_to_editors(payment):
    """Notify editors that a payment proof has been uploaded and needs verification."""
    from users.models import User
    editors = User.objects.filter(role__in=['editor', 'admin']).values_list('email', flat=True)
    if not editors:
        return False
    paper = payment.paper
    body = f'''
    <p style="color:#202124;">A payment proof has been uploaded and needs verification.</p>
    <div style="background:#fff8e1;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #FBBC04;">
      <p style="margin:4px 0;color:#202124;"><strong>Paper:</strong> {paper.title} (IRA-{paper.id:04d})</p>
      <p style="margin:4px 0;color:#202124;"><strong>Author:</strong> {paper.submitted_by.name}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Transaction ID:</strong> {payment.transaction_id}</p>
      <p style="margin:4px 0;color:#202124;"><strong>Amount:</strong> ₹{payment.amount}</p>
    </div>
    <p style="color:#5f6368;">Please log in to verify this payment.</p>
    '''
    html = _wrap_html("Payment Verification Needed", body)
    return _send(f"Payment Verification Needed - IRA-{paper.id:04d}", html, list(editors))
