from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Paper, PaperAuthor, Payment
from .serializers import (
    CategorySerializer,
    PaperListSerializer,
    PaperCreateSerializer,
    PaperDetailSerializer,
    PaperUpdateSerializer,
    PaperAuthorSerializer,
    PaymentSerializer,
    PaymentProofSerializer,
)
from users.permissions import IsAdmin, IsEditor
from .pdf_processor import process_paper_pdf
from . import email_service


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
        paper = serializer.save(submitted_by=self.request.user)
        # Send emails asynchronously (best-effort)
        try:
            email_service.send_paper_submitted_email(paper)
            email_service.send_new_submission_to_editors(paper)
        except Exception:
            pass  # Don't fail submission if email fails

    def get_permissions(self):
        if self.action in ('destroy', 'process_pdf'):
            return [IsAuthenticated(), IsEditor()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], url_path='process-pdf')
    def process_pdf(self, request, pk=None):
        """Editor triggers PDF processing (adds IRA header/footer)."""
        paper = self.get_object()
        if not paper.pdf_file:
            return Response(
                {'detail': 'No PDF file attached to this paper.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        success = process_paper_pdf(paper)
        if success:
            return Response({'detail': 'PDF processed successfully.'})
        return Response(
            {'detail': 'PDF processing failed.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


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


class PaymentViewSet(viewsets.GenericViewSet):
    """
    Payment workflow endpoints.
    - GET /papers/<id>/payment/ — get payment details
    - POST /papers/<id>/payment/upload-proof/ — upload payment proof
    - POST /papers/<id>/payment/verify/ — editor verifies payment
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_parsers(self):
        # upload-proof needs multipart, verify needs JSON
        if getattr(self, 'action', None) == 'upload_proof':
            return [MultiPartParser(), FormParser()]
        return super().get_parsers()

    def get_payment(self):
        paper_id = self.kwargs.get('paper_pk')
        return Payment.objects.select_related('paper', 'verified_by').get(
            paper_id=paper_id
        )

    def retrieve(self, request, *args, **kwargs):
        """Get payment details for a paper."""
        try:
            payment = self.get_payment()
        except Payment.DoesNotExist:
            return Response(
                {'detail': 'No payment record found for this paper.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Only paper owner or editor/admin can view
        if (
            payment.paper.submitted_by != request.user
            and request.user.role not in ('editor', 'admin')
        ):
            return Response(
                {'detail': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='upload-proof')
    def upload_proof(self, request, *args, **kwargs):
        """Author uploads payment proof screenshot + transaction ID."""
        try:
            payment = self.get_payment()
        except Payment.DoesNotExist:
            return Response(
                {'detail': 'No payment record found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Only paper owner can upload proof
        if payment.paper.submitted_by != request.user:
            return Response(
                {'detail': 'Only the paper author can upload payment proof.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        if payment.status == 'verified':
            return Response(
                {'detail': 'Payment already verified.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        proof_serializer = PaymentProofSerializer(data=request.data)
        proof_serializer.is_valid(raise_exception=True)
        payment.payment_proof = proof_serializer.validated_data['payment_proof']
        payment.transaction_id = proof_serializer.validated_data['transaction_id']
        payment.status = 'submitted'
        payment.save()
        try:
            email_service.send_payment_proof_uploaded_email(payment)
            email_service.send_payment_proof_to_editors(payment)
        except Exception:
            pass
        return Response(PaymentSerializer(payment).data)

    @action(detail=False, methods=['post'], url_path='verify')
    def verify(self, request, *args, **kwargs):
        """Editor/Admin verifies or rejects a payment."""
        try:
            payment = self.get_payment()
        except Payment.DoesNotExist:
            return Response(
                {'detail': 'No payment record found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if request.user.role not in ('editor', 'admin'):
            return Response(
                {'detail': 'Only editors can verify payments.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        action_type = request.data.get('action')  # 'verify' or 'reject'
        notes = request.data.get('notes', '')
        if action_type == 'verify':
            payment.status = 'verified'
            payment.verified_by = request.user
            payment.verified_at = timezone.now()
            payment.notes = notes
            payment.save()
            payment.paper.status = 'payment_verified'
            payment.paper.save()
            try:
                email_service.send_payment_verified_email(payment)
            except Exception:
                pass
        elif action_type == 'reject':
            payment.status = 'rejected'
            payment.verified_by = request.user
            payment.verified_at = timezone.now()
            payment.notes = notes
            payment.save()
            try:
                email_service.send_payment_rejected_email(payment)
            except Exception:
                pass
        else:
            return Response(
                {'detail': 'Invalid action. Use "verify" or "reject".'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(PaymentSerializer(payment).data)
