from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'journal'

router = DefaultRouter()
router.register(r'volumes', views.VolumeViewSet, basename='volume')
router.register(r'issues', views.IssueViewSet, basename='issue')

urlpatterns = [
    path('', include(router.urls)),
    path('paper-issues/', views.PaperIssueView.as_view(), name='paper-issue-list-create'),
    path('paper-issues/<int:pk>/', views.PaperIssueView.as_view(), name='paper-issue-detail'),
    path('paper-issues/issue/<int:issue_id>/', views.PaperIssueView.as_view(), name='paper-issue-by-issue'),
    path('archive/', views.ArchiveView.as_view(), name='archive'),
]
