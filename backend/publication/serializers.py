from rest_framework import serializers
from .models import PublicationRecord


class PublicationRecordSerializer(serializers.ModelSerializer):
    paper_title = serializers.CharField(source='paper.title', read_only=True)
    is_ready = serializers.BooleanField(read_only=True)

    class Meta:
        model = PublicationRecord
        fields = ['id', 'paper', 'paper_title', 'doi_generated', 'pdf_formatted',
                  'plagiarism_cleared', 'published_by', 'published_in_volume',
                  'published_in_issue', 'notes', 'is_ready', 'created_at', 'updated_at']
        read_only_fields = ['id', 'published_by', 'created_at', 'updated_at']
