from django.urls import path
from .views import CheckPlagiarismView, GetReportView

urlpatterns = [
    path('check/<int:paper_id>/', CheckPlagiarismView.as_view(), name='plagiarism-check'),
    path('report/<int:paper_id>/', GetReportView.as_view(), name='plagiarism-report'),
]
