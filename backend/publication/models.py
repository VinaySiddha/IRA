from django.db import models
from papers.models import Paper
from django.conf import settings


class PublicationRecord(models.Model):
    """Tracks the publication pipeline for a paper."""
    paper = models.OneToOneField(Paper, on_delete=models.CASCADE, related_name='publication_record')
    doi_generated = models.BooleanField(default=False)
    pdf_formatted = models.BooleanField(default=False)
    plagiarism_cleared = models.BooleanField(default=False)
    published_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='publications_made'
    )
    published_in_volume = models.CharField(max_length=50, blank=True)
    published_in_issue = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Publication: {self.paper.title}"

    @property
    def is_ready(self):
        return self.doi_generated and self.pdf_formatted and self.plagiarism_cleared
