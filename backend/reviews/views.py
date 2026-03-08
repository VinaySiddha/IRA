from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from papers.models import Paper
from users.models import User
from users.permissions import IsEditor, IsReviewer
from .models import Review, EditorialDecision
from .serializers import (
    ReviewSerializer,
    ReviewAssignSerializer,
    ReviewSubmitSerializer,
    EditorialDecisionSerializer,
    EditorialDecisionCreateSerializer,
)


class ReviewAssignView(APIView):
    """Editor assigns a reviewer to a paper."""
    permission_classes = [IsAuthenticated, IsEditor]

    def post(self, request):
        serializer = ReviewAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        paper_id = serializer.validated_data['paper_id']
        reviewer_id = serializer.validated_data['reviewer_id']

        try:
            paper = Paper.objects.get(pk=paper_id)
        except Paper.DoesNotExist:
            return Response(
                {'error': 'Paper not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            reviewer = User.objects.get(pk=reviewer_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Reviewer not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if reviewer.role not in ('reviewer', 'editor', 'admin'):
            return Response(
                {'error': 'Selected user is not a reviewer.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Review.objects.filter(paper=paper, reviewer=reviewer).exists():
            return Response(
                {'error': 'This reviewer is already assigned to this paper.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        review = Review.objects.create(
            paper=paper,
            reviewer=reviewer,
            assigned_by=request.user,
            status='pending'
        )

        # Update paper status to under_review if it's still submitted
        if paper.status == 'submitted':
            paper.status = 'under_review'
            paper.save()

        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )


class ReviewSubmitView(APIView):
    """Reviewer submits their review for a paper."""
    permission_classes = [IsAuthenticated, IsReviewer]

    def put(self, request, review_id):
        try:
            review = Review.objects.get(pk=review_id, reviewer=request.user)
        except Review.DoesNotExist:
            return Response(
                {'error': 'Review not found or you are not the assigned reviewer.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if review.status == 'completed':
            return Response(
                {'error': 'This review has already been completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReviewSubmitSerializer(review, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(status='completed', completed_at=timezone.now())

        return Response(ReviewSerializer(review).data)


class MyAssignmentsView(ListAPIView):
    """Reviewer sees their assigned reviews."""
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsReviewer]

    def get_queryset(self):
        return Review.objects.filter(
            reviewer=self.request.user
        ).select_related('paper', 'assigned_by', 'reviewer')


class EditorialDecisionView(APIView):
    """Editor makes a decision on a paper."""
    permission_classes = [IsAuthenticated, IsEditor]

    def get(self, request, paper_id=None):
        """List editorial decisions, optionally filtered by paper."""
        queryset = EditorialDecision.objects.all().select_related('paper', 'editor')
        if paper_id:
            queryset = queryset.filter(paper_id=paper_id)
        serializer = EditorialDecisionSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new editorial decision."""
        serializer = EditorialDecisionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        paper = serializer.validated_data['paper']
        decision = serializer.validated_data['decision']

        editorial_decision = serializer.save(editor=request.user)

        # Update paper status based on decision
        status_map = {
            'accept': 'accepted',
            'minor_revision': 'revision_requested',
            'major_revision': 'revision_requested',
            'reject': 'rejected',
        }
        paper.status = status_map.get(decision, paper.status)
        paper.save()

        return Response(
            EditorialDecisionSerializer(editorial_decision).data,
            status=status.HTTP_201_CREATED
        )
