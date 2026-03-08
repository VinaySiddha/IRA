from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Paper(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('payment_pending', 'Payment Pending'),
        ('payment_verified', 'Payment Verified'),
        ('under_review', 'Under Review'),
        ('revision_requested', 'Revision Requested'),
        ('revised', 'Revised'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=500)
    abstract = models.TextField()
    keywords = models.CharField(max_length=500, blank=True, help_text='Comma-separated keywords')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='papers')
    corresponding_email = models.EmailField()
    pdf_file = models.FileField(upload_to='papers/pdfs/%Y/%m/', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submitted_papers'
    )
    doi = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name='DOI')
    citation_text = models.TextField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('submitted', 'Proof Submitted'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    paper = models.OneToOneField(Paper, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    upi_number = models.CharField(max_length=15, default='+919849372827')
    payment_proof = models.ImageField(upload_to='payments/proofs/%Y/%m/', blank=True)
    transaction_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_payments'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment for {self.paper.title} - {self.status}"


class PaperAuthor(models.Model):
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='authors')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='authored_papers'
    )
    author_name = models.CharField(max_length=255)
    affiliation = models.CharField(max_length=500, blank=True)
    author_order = models.PositiveIntegerField(default=1)
    is_corresponding = models.BooleanField(default=False)

    class Meta:
        ordering = ['author_order']
        unique_together = ['paper', 'author_order']

    def __str__(self):
        return f"{self.author_name} - {self.paper.title}"
