from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from papers.models import Paper
from .models import PlagiarismReport
from .serializers import PlagiarismReportSerializer
from .checker import check_plagiarism


class IsEditor(IsAuthenticated):
    """Allow only editors and admins."""

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.role in ('editor', 'admin')


class CheckPlagiarismView(APIView):
    """
    POST /api/v1/plagiarism/check/<paper_id>/

    Run a plagiarism check on the specified paper, save/update the
    PlagiarismReport, and return the results.
    Requires editor or admin role.
    """
    permission_classes = [IsEditor]

    def post(self, request, paper_id):
        try:
            paper = Paper.objects.get(id=paper_id)
        except Paper.DoesNotExist:
            return Response(
                {'error': 'Paper not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Run plagiarism check
        result = check_plagiarism(paper)

        # Save or update the report
        report, _created = PlagiarismReport.objects.update_or_create(
            paper=paper,
            defaults={
                'similarity_score': result['similarity_score'],
                'is_flagged': result['is_flagged'],
                'report_data': {
                    'matches': result['matches'],
                    'total_compared': result['total_compared'],
                },
            },
        )

        serializer = PlagiarismReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetReportView(APIView):
    """
    GET /api/v1/plagiarism/report/<paper_id>/

    Retrieve an existing plagiarism report for the given paper.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, paper_id):
        try:
            report = PlagiarismReport.objects.select_related('paper').get(paper_id=paper_id)
        except PlagiarismReport.DoesNotExist:
            return Response(
                {'error': 'No plagiarism report found for this paper.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PlagiarismReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_200_OK)
