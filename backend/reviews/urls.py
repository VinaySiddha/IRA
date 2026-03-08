from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('assign/', views.ReviewAssignView.as_view(), name='review-assign'),
    path('<int:review_id>/submit/', views.ReviewSubmitView.as_view(), name='review-submit'),
    path('my-assignments/', views.MyAssignmentsView.as_view(), name='my-assignments'),
    path('decisions/', views.EditorialDecisionView.as_view(), name='editorial-decisions'),
    path('decisions/paper/<int:paper_id>/', views.EditorialDecisionView.as_view(), name='editorial-decisions-paper'),
]
