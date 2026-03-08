from django.db import models


class Volume(models.Model):
    volume_number = models.PositiveIntegerField(unique=True)
    year = models.PositiveIntegerField()
    title = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-volume_number']

    def __str__(self):
        return f"Volume {self.volume_number} ({self.year})"


class Issue(models.Model):
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE, related_name='issues')
    issue_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ['-volume__volume_number', '-issue_number']
        unique_together = ['volume', 'issue_number']

    def __str__(self):
        return f"Vol. {self.volume.volume_number}, Issue {self.issue_number}"


class PaperIssue(models.Model):
    paper = models.ForeignKey(
        'papers.Paper',
        on_delete=models.CASCADE,
        related_name='issue_assignments'
    )
    issue = models.ForeignKey(
        Issue,
        on_delete=models.CASCADE,
        related_name='paper_assignments'
    )
    page_start = models.PositiveIntegerField(null=True, blank=True)
    page_end = models.PositiveIntegerField(null=True, blank=True)
    order_in_issue = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order_in_issue']
        unique_together = ['paper', 'issue']

    def __str__(self):
        return f"{self.paper.title} in {self.issue}"
