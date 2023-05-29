from foods.api.views import FoodViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', FoodViewSet, basename='foods')
urlpatterns = router.urls

# from django.urls import path

# from .views import (
#     FoodListView,
#     FoodDetailView,
#     FoodCreateView,
#     FoodUpdateView,
#     FoodDeleteView
# )

# urlpatterns = [
#     path('', FoodListView.as_view()),
#     path('create/', FoodCreateView.as_view()),
#     path('<pk>', FoodDetailView.as_view()),
#     path('<pk>/update/', FoodUpdateView.as_view()),
#     path('<pk>/delete/', FoodDeleteView.as_view())
# ]
