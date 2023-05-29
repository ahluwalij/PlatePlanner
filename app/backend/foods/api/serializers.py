from rest_framework import serializers

from foods.models import Food


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ('id', 'created_by', 'meal', 'date')
