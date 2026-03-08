from django.contrib import admin
from .models import Category, Paper, PaperAuthor


class PaperAuthorInline(admin.TabularInline):
    model = PaperAuthor
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(Paper)
class PaperAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'category', 'submitted_by', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'abstract', 'keywords')
    inlines = [PaperAuthorInline]


@admin.register(PaperAuthor)
class PaperAuthorAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'paper', 'author_order', 'is_corresponding')
    list_filter = ('is_corresponding',)
