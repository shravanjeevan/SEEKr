from rest_framework import serializers
from django.contrib.auth.models import User

from .models import JobSeekerDetails

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class JobSeekerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerDetails
        fields = ('id', 'UserId', 'Description', 'Education')
