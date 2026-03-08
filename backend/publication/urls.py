from django.urls import path
from .views import (
    GenerateDOIView,
    PublishPaperView,
    PublicationDetailView,
)

urlpatterns = [
    path('<int:paper_id>/generate-doi/', GenerateDOIView.as_view(), name='generate-doi'),
    path('<int:paper_id>/publish/', PublishPaperView.as_view(), name='publish-paper'),
    path('<int:paper_id>/', PublicationDetailView.as_view(), name='publication-detail'),
]
