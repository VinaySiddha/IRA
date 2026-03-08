from rest_framework import serializers
from .models import Volume, Issue, PaperIssue
from papers.serializers import PaperListSerializer


class VolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volume
        fields = ['id', 'volume_number', 'year', 'title']


class IssueSerializer(serializers.ModelSerializer):
    volume_detail = VolumeSerializer(source='volume', read_only=True)

    class Meta:
        model = Issue
        fields = [
            'id', 'volume', 'volume_detail', 'issue_number', 'title',
            'description', 'published_at', 'is_published'
        ]


class PaperIssueSerializer(serializers.ModelSerializer):
    paper_detail = PaperListSerializer(source='paper', read_only=True)
    issue_detail = IssueSerializer(source='issue', read_only=True)

    class Meta:
        model = PaperIssue
        fields = [
            'id', 'paper', 'paper_detail', 'issue', 'issue_detail',
            'page_start', 'page_end', 'order_in_issue'
        ]


class VolumeDetailSerializer(serializers.ModelSerializer):
    """Volume with nested issues."""
    issues = IssueSerializer(many=True, read_only=True)

    class Meta:
        model = Volume
        fields = ['id', 'volume_number', 'year', 'title', 'issues']


class IssueDetailSerializer(serializers.ModelSerializer):
    """Issue with nested papers."""
    volume_detail = VolumeSerializer(source='volume', read_only=True)
    papers = PaperIssueSerializer(source='paper_assignments', many=True, read_only=True)

    class Meta:
        model = Issue
        fields = [
            'id', 'volume', 'volume_detail', 'issue_number', 'title',
            'description', 'published_at', 'is_published', 'papers'
        ]
