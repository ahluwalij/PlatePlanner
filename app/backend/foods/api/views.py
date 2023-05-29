from rest_framework import viewsets
from foods.models import Food
from .serializers import FoodSerializer


# this class handles all of the requests below (get, post, update, delete)
# in much less code

class FoodViewSet(viewsets.ModelViewSet):
    serializer_class = FoodSerializer
    # queryset = Food.objects.all()
    # queryset = Food.objects.filter(userID=2)

    def get_queryset(self):
        return Food.objects.filter(created_by=self.request.user.username)

    def get_count(self):
        return Food.objects.filter(created_by=self.request.user.username).count()

# old method
# from rest_framework.generics import (
#     ListAPIView,
#     RetrieveAPIView,
#     CreateAPIView,
#     DestroyAPIView,
#     UpdateAPIView
# )

# class FoodListView(ListAPIView):
#     queryset = Food.objects.all()
#     serializer_class = FoodSerializer

# class FoodDetailView(RetrieveAPIView):
#     queryset = Food.objects.all()
#     serializer_class = FoodSerializer

# class FoodCreateView(CreateAPIView):
#     queryset = Food.objects.all()
#     serializer_class = FoodSerializer

# class FoodUpdateView(UpdateAPIView):
#     queryset = Food.objects.all()
#     serializer_class = FoodSerializer
# class FoodDeleteView(DestroyAPIView):
#     queryset = Food.objects.all()
#     serializer_class = FoodSerializer
