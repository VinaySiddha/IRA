from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination

from papers.models import Paper, PaperAuthor

# Try to import PostgreSQL full-text search utilities.
# These will only work when the database backend is PostgreSQL.
try:
    from django.contrib.postgres.search import SearchVector, SearchRank, SearchQuery
    POSTGRES_SEARCH_AVAILABLE = True
except ImportError:
    POSTGRES_SEARCH_AVAILABLE = False


class SearchPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class SearchView(APIView):
    """
    Public full-text search across papers.

    GET /api/v1/search/?q=<query>

    Optional filters:
        - category: category id
        - status: paper status (e.g. published, accepted)
        - year: publication/creation year
        - page: page number for pagination
        - page_size: results per page (max 100)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        category = request.query_params.get('category')
        status = request.query_params.get('status')
        year = request.query_params.get('year')

        if not query:
            return Response({
                'count': 0,
                'next': None,
                'previous': None,
                'results': [],
                'message': 'Please provide a search query using the "q" parameter.',
            })

        queryset = Paper.objects.all()

        # -----------------------------------------------------------
        # Apply optional filters before the text search
        # -----------------------------------------------------------
        if category:
            queryset = queryset.filter(category_id=category)

        if status:
            queryset = queryset.filter(status=status)

        if year:
            try:
                year = int(year)
                queryset = queryset.filter(created_at__year=year)
            except (ValueError, TypeError):
                pass

        # -----------------------------------------------------------
        # Full-text search
        # -----------------------------------------------------------
        use_postgres = POSTGRES_SEARCH_AVAILABLE and self._is_postgres()

        if use_postgres:
            # PostgreSQL full-text search with ranking
            search_vector = SearchVector('title', weight='A') + \
                            SearchVector('abstract', weight='B') + \
                            SearchVector('keywords', weight='B')
            search_query = SearchQuery(query)
            queryset = queryset.annotate(
                search=search_vector,
                rank=SearchRank(search_vector, search_query),
            ).filter(search=search_query).order_by('-rank')
        else:
            # Fallback: simple Q-based filtering (works with SQLite)
            terms = query.split()
            q_filter = Q()
            for term in terms:
                q_filter &= (
                    Q(title__icontains=term) |
                    Q(abstract__icontains=term) |
                    Q(keywords__icontains=term) |
                    Q(authors__author_name__icontains=term)
                )
            queryset = queryset.filter(q_filter).distinct()

        # -----------------------------------------------------------
        # Paginate
        # -----------------------------------------------------------
        paginator = SearchPagination()
        page = paginator.paginate_queryset(queryset, request)

        results = []
        for paper in page:
            authors = PaperAuthor.objects.filter(paper=paper).order_by('author_order')
            results.append({
                'id': paper.id,
                'title': paper.title,
                'abstract': paper.abstract[:300] + ('...' if len(paper.abstract) > 300 else ''),
                'keywords': paper.keywords,
                'category': paper.category.name if paper.category else None,
                'status': paper.status,
                'authors': [
                    {
                        'name': a.author_name,
                        'affiliation': a.affiliation,
                        'is_corresponding': a.is_corresponding,
                    }
                    for a in authors
                ],
                'doi': paper.doi,
                'published_at': paper.published_at,
                'created_at': paper.created_at,
            })

        return paginator.get_paginated_response(results)

    @staticmethod
    def _is_postgres():
        """Check whether the default database engine is PostgreSQL."""
        from django.conf import settings
        engine = settings.DATABASES.get('default', {}).get('ENGINE', '')
        return 'postgresql' in engine
