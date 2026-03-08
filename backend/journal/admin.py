from django.contrib import admin
from .models import Volume, Issue, PaperIssue


class IssueInline(admin.TabularInline):
    model = Issue
    extra = 1


class PaperIssueInline(admin.TabularInline):
    model = PaperIssue
    extra = 1


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    list_display = ('volume_number', 'year', 'title')
    inlines = [IssueInline]


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('volume', 'issue_number', 'title', 'is_published', 'published_at')
    list_filter = ('is_published', 'volume')
    inlines = [PaperIssueInline]


@admin.register(PaperIssue)
class PaperIssueAdmin(admin.ModelAdmin):
    list_display = ('paper', 'issue', 'page_start', 'page_end', 'order_in_issue')
