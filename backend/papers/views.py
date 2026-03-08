from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Paper, PaperAuthor
from .serializers import (
    CategorySerializer,
    PaperListSerializer,
    PaperCreateSerializer,
    PaperDetailSerializer,
    PaperUpdateSerializer,
    PaperAuthorSerializer,
)
from users.permissions import IsAdmin, IsEditor


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for paper categories.
    - List/Retrieve: any authenticated user
    - Create/Update/Delete: admin or editor only
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]


class PaperViewSet(viewsets.ModelViewSet):
    """
    CRUD for papers.
    - Authors can create papers and view their own
    - Editors/Admins can view all papers and update status
    - Search/filter by status, category, keyword
    """
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title', 'abstract', 'keywords']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return PaperCreateSerializer
        if self.action in ('update', 'partial_update'):
            return PaperUpdateSerializer
        if self.action == 'retrieve':
            return PaperDetailSerializer
        return PaperListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ('editor', 'admin'):
            return Paper.objects.all().select_related('submitted_by', 'category').prefetch_related('authors')

        # Authors see only their own papers
        return Paper.objects.filter(
            submitted_by=user
        ).select_related('submitted_by', 'category').prefetch_related('authors')

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsAuthenticated(), IsEditor()]
        return [IsAuthenticated()]


class PaperAuthorViewSet(viewsets.ModelViewSet):
    """Manage authors of a paper."""
    serializer_class = PaperAuthorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaperAuthor.objects.filter(
            paper_id=self.kwargs.get('paper_pk')
        )

    def perform_create(self, serializer):
        serializer.save(paper_id=self.kwargs.get('paper_pk'))
