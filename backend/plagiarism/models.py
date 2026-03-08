from django.db import models
from papers.models import Paper


class PlagiarismReport(models.Model):
    paper = models.OneToOneField(Paper, on_delete=models.CASCADE, related_name='plagiarism_report')
    similarity_score = models.FloatField(default=0.0, help_text='Overall similarity percentage 0-100')
    is_flagged = models.BooleanField(default=False, help_text='True if similarity > threshold')
    report_data = models.JSONField(default=dict, blank=True, help_text='Detailed match data')
    checked_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Plagiarism Report for {self.paper.title} - {self.similarity_score}%"
