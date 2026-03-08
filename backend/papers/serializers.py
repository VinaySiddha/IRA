from rest_framework import serializers
from .models import Category, Paper, PaperAuthor
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class PaperAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaperAuthor
        fields = ['id', 'paper', 'user', 'author_name', 'affiliation', 'author_order', 'is_corresponding']
        read_only_fields = ['id']


class PaperListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing papers."""
    submitted_by = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    authors = PaperAuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Paper
        fields = [
            'id', 'title', 'abstract', 'keywords', 'category',
            'status', 'submitted_by', 'authors', 'doi',
            'published_at', 'created_at', 'updated_at'
        ]


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
        paper = Paper.objects.create(**validated_data)
        for author_data in authors_data:
            PaperAuthor.objects.create(paper=paper, **author_data)
        return paper


class PaperDetailSerializer(serializers.ModelSerializer):
    submitted_by = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    authors = PaperAuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Paper
        fields = [
            'id', 'title', 'abstract', 'keywords', 'category',
            'corresponding_email', 'pdf_file', 'status',
            'submitted_by', 'authors', 'doi', 'citation_text',
            'published_at', 'created_at', 'updated_at'
        ]


class PaperUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = [
            'title', 'abstract', 'keywords', 'category',
            'corresponding_email', 'pdf_file', 'status',
            'doi', 'citation_text'
        ]
