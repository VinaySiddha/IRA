from rest_framework import serializers
from .models import PlagiarismReport


class PlagiarismReportSerializer(serializers.ModelSerializer):
    paper_title = serializers.CharField(source='paper.title', read_only=True)

    class Meta:
        model = PlagiarismReport
        fields = ['id', 'paper', 'paper_title', 'similarity_score', 'is_flagged', 'report_data', 'checked_at', 'created_at']
        read_only_fields = ['id', 'similarity_score', 'is_flagged', 'report_data', 'checked_at', 'created_at']
