from rest_framework import serializers
from .models import Review, EditorialDecision
from users.serializers import UserSerializer
from papers.serializers import PaperListSerializer


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    assigned_by = UserSerializer(read_only=True)
    paper_detail = PaperListSerializer(source='paper', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'paper', 'paper_detail', 'reviewer', 'assigned_by',
            'comments', 'score', 'recommendation', 'status',
            'assigned_at', 'completed_at'
        ]
        read_only_fields = ['id', 'assigned_at', 'completed_at']


class ReviewAssignSerializer(serializers.Serializer):
    paper_id = serializers.IntegerField()
    reviewer_id = serializers.IntegerField()


class ReviewSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['comments', 'score', 'recommendation']

    def validate_score(self, value):
        if value is not None and (value < 1 or value > 10):
            raise serializers.ValidationError('Score must be between 1 and 10.')
        return value

    def validate_recommendation(self, value):
        if not value:
            raise serializers.ValidationError('Recommendation is required.')
        return value


class EditorialDecisionSerializer(serializers.ModelSerializer):
    editor = UserSerializer(read_only=True)
    paper_detail = PaperListSerializer(source='paper', read_only=True)

    class Meta:
        model = EditorialDecision
        fields = ['id', 'paper', 'paper_detail', 'editor', 'decision', 'comments', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class EditorialDecisionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EditorialDecision
        fields = ['paper', 'decision', 'comments']
