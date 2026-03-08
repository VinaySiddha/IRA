from rest_framework import serializers
from .models import Category, Paper, PaperAuthor, Payment
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class PaperAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaperAuthor
        fields = ['id', 'paper', 'user', 'author_name', 'affiliation', 'author_order', 'is_corresponding']
        read_only_fields = ['id', 'paper']


class PaymentSerializer(serializers.ModelSerializer):
    verified_by = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'paper', 'amount', 'upi_number', 'payment_proof',
            'transaction_id', 'status', 'verified_by', 'notes',
            'created_at', 'verified_at'
        ]
        read_only_fields = ['id', 'paper', 'amount', 'upi_number', 'verified_by', 'verified_at']


class PaymentProofSerializer(serializers.Serializer):
    payment_proof = serializers.ImageField()
    transaction_id = serializers.CharField(max_length=255)


class PaperListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing papers."""
    submitted_by = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    authors = PaperAuthorSerializer(many=True, read_only=True)
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Paper
        fields = [
            'id', 'title', 'abstract', 'keywords', 'category',
            'status', 'submitted_by', 'authors', 'doi',
            'published_at', 'created_at', 'updated_at', 'payment_status'
        ]

    def get_payment_status(self, obj):
        try:
            return obj.payment.status
        except Payment.DoesNotExist:
            return None


class PaperCreateSerializer(serializers.ModelSerializer):
    authors = PaperAuthorSerializer(many=True, required=False)

    class Meta:
        model = Paper
        fields = [
            'id', 'title', 'abstract', 'keywords', 'category',
            'corresponding_email', 'pdf_file', 'authors'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        authors_data = validated_data.pop('authors', [])
        validated_data['status'] = 'payment_pending'
        paper = Paper.objects.create(**validated_data)
        for author_data in authors_data:
            PaperAuthor.objects.create(paper=paper, **author_data)
        # Create payment record
        Payment.objects.create(paper=paper)
        return paper


class PaperDetailSerializer(serializers.ModelSerializer):
    submitted_by = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    authors = PaperAuthorSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Paper
        fields = [
            'id', 'title', 'abstract', 'keywords', 'category',
            'corresponding_email', 'pdf_file', 'status',
            'submitted_by', 'authors', 'doi', 'citation_text',
            'published_at', 'created_at', 'updated_at', 'payment'
        ]


class PaperUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = [
            'title', 'abstract', 'keywords', 'category',
            'corresponding_email', 'pdf_file', 'status',
            'doi', 'citation_text'
        ]
