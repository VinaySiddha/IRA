from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from papers.models import Paper
from users.permissions import IsAdmin, IsEditor
from .models import Volume, Issue, PaperIssue
from .serializers import (
    VolumeSerializer,
    VolumeDetailSerializer,
    IssueSerializer,
    IssueDetailSerializer,
    PaperIssueSerializer,
)


class VolumeViewSet(viewsets.ModelViewSet):
    """
    CRUD for journal volumes.
    - List/Retrieve: any authenticated user
    - Create/Update/Delete: admin only
    """
    queryset = Volume.objects.all().prefetch_related('issues')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VolumeDetailSerializer
        return VolumeSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]


class IssueViewSet(viewsets.ModelViewSet):
    """
    CRUD for journal issues.
    - List/Retrieve: any authenticated user
    - Create/Update/Delete: admin only
    - Publish action: admin/editor only
    """
    queryset = Issue.objects.all().select_related('volume').prefetch_related('paper_assignments')
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['volume', 'is_published']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return IssueDetailSerializer
        return IssueSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'publish']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish an issue - marks it as published and sets published_at."""
        issue = self.get_object()

        if issue.is_published:
            return Response(
                {'error': 'Issue is already published.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        issue.is_published = True
        issue.published_at = timezone.now()
        issue.save()

        # Also update all papers in this issue to 'published' status
        paper_ids = issue.paper_assignments.values_list('paper_id', flat=True)
        Paper.objects.filter(pk__in=paper_ids).update(
            status='published',
            published_at=timezone.now()
        )

        return Response(IssueDetailSerializer(issue).data)


class PaperIssueView(APIView):
    """Assign a paper to an issue."""
    permission_classes = [IsAuthenticated, IsEditor]

    def get(self, request, issue_id=None):
        """List papers in an issue."""
        queryset = PaperIssue.objects.all().select_related('paper', 'issue')
        if issue_id:
            queryset = queryset.filter(issue_id=issue_id)
        serializer = PaperIssueSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Assign a paper to an issue."""
        serializer = PaperIssueSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk=None):
        """Remove a paper from an issue."""
        if not pk:
            return Response(
                {'error': 'PaperIssue ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            paper_issue = PaperIssue.objects.get(pk=pk)
        except PaperIssue.DoesNotExist:
            return Response(
                {'error': 'PaperIssue not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        paper_issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ArchiveView(ListAPIView):
    """
    Public view of published papers with search and filter.
    No authentication required.
    """
    serializer_class = PaperIssueSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'paper__title', 'paper__abstract', 'paper__keywords',
        'paper__authors__author_name'
    ]
    ordering_fields = ['paper__published_at', 'paper__title', 'order_in_issue']
    ordering = ['-paper__published_at']

    def get_queryset(self):
        return PaperIssue.objects.filter(
            issue__is_published=True,
            paper__status='published'
        ).select_related(
            'paper', 'paper__category', 'paper__submitted_by',
            'issue', 'issue__volume'
        ).prefetch_related('paper__authors')
