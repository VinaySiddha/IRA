from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'papers'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'', views.PaperViewSet, basename='paper')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:paper_pk>/authors/', views.PaperAuthorViewSet.as_view({
        'get': 'list',
        'post': 'create',
    }), name='paper-authors'),
    path('<int:paper_pk>/authors/<int:pk>/', views.PaperAuthorViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    }), name='paper-author-detail'),
]
