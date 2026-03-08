from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404

from papers.models import Paper
from users.permissions import IsEditor
from .models import PublicationRecord
from .serializers import PublicationRecordSerializer


class GenerateDOIView(APIView):
    """
    POST /api/v1/publication/<paper_id>/generate-doi/
    Auto-generates a DOI and saves it to the Paper.
    Updates PublicationRecord.doi_generated = True.
    Requires IsEditor permission.
    """
    permission_classes = [IsAuthenticated, IsEditor]

    def post(self, request, paper_id):
        paper = get_object_or_404(Paper, pk=paper_id)

        # Generate DOI
        doi = f"10.5281/ira.2025.{paper_id:04d}"

        # Save DOI to the paper
        paper.doi = doi
        paper.save(update_fields=['doi'])

        # Get or create the publication record and mark DOI as generated
        record, _ = PublicationRecord.objects.get_or_create(paper=paper)
        record.doi_generated = True
        record.save(update_fields=['doi_generated', 'updated_at'])

        serializer = PublicationRecordSerializer(record)
        return Response(
            {
                'detail': f'DOI generated successfully: {doi}',
                'doi': doi,
                'publication_record': serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PublishPaperView(APIView):
    """
    POST /api/v1/publication/<paper_id>/publish/
    Checks that the paper is accepted and the publication record is_ready.
    Sets Paper.status = 'published' and Paper.published_at = now.
    Requires IsEditor permission.
    """
    permission_classes = [IsAuthenticated, IsEditor]

    def post(self, request, paper_id):
        paper = get_object_or_404(Paper, pk=paper_id)

        # Paper must be in 'accepted' status to be published
        if paper.status != 'accepted':
            return Response(
                {'detail': f'Paper must be accepted before publishing. Current status: {paper.status}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get or create publication record and check readiness
        record, _ = PublicationRecord.objects.get_or_create(paper=paper)

        if not record.is_ready:
            missing = []
            if not record.doi_generated:
                missing.append('DOI not generated')
            if not record.pdf_formatted:
                missing.append('PDF not formatted')
            if not record.plagiarism_cleared:
                missing.append('Plagiarism not cleared')
            return Response(
                {
                    'detail': 'Publication record is not ready.',
                    'missing': missing,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Publish the paper
        paper.status = 'published'
        paper.published_at = timezone.now()
        paper.save(update_fields=['status', 'published_at', 'updated_at'])

        # Record who published it
        record.published_by = request.user
        record.save(update_fields=['published_by', 'updated_at'])

        serializer = PublicationRecordSerializer(record)
        return Response(
            {
                'detail': 'Paper published successfully.',
                'publication_record': serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PublicationDetailView(APIView):
    """
    GET  /api/v1/publication/<paper_id>/ — returns PublicationRecord (creates if missing)
    PATCH /api/v1/publication/<paper_id>/ — updates record fields (editor only)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, paper_id):
        """
        Returns the PublicationRecord for a paper.
        Creates one if it doesn't exist.
        Requires IsAuthenticated.
        """
        paper = get_object_or_404(Paper, pk=paper_id)
        record, _ = PublicationRecord.objects.get_or_create(paper=paper)
        serializer = PublicationRecordSerializer(record)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, paper_id):
        """
        Update publication record fields (pdf_formatted, plagiarism_cleared, etc.).
        Requires IsEditor permission.
        """
        # Check editor permission for PATCH
        editor_perm = IsEditor()
        if not editor_perm.has_permission(request, self):
            return Response(
                {'detail': 'Only editors can update publication records.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        paper = get_object_or_404(Paper, pk=paper_id)
        record, _ = PublicationRecord.objects.get_or_create(paper=paper)

        serializer = PublicationRecordSerializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
