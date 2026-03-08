from django.contrib import admin
from .models import Review, EditorialDecision


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('paper', 'reviewer', 'status', 'score', 'recommendation', 'assigned_at')
    list_filter = ('status', 'recommendation')
    search_fields = ('paper__title', 'reviewer__name')


@admin.register(EditorialDecision)
class EditorialDecisionAdmin(admin.ModelAdmin):
    list_display = ('paper', 'editor', 'decision', 'timestamp')
    list_filter = ('decision',)
    search_fields = ('paper__title', 'editor__name')
