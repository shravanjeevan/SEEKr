from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Skills, JobListing, JobMatch, JobListingSkills, JobSeekerSkills
from django.contrib.auth import authenticate
from .models import JobSeekerDetails

import pandas as pd
import numpy as np
from django.http import HttpResponse

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'UserId', 'Name', "Description", 'Industry')


class JobSeekerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerDetails
        fields = ('id', 'UserId', 'Description', 'Education', 'Longitude', 'Latitude')


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ('id', 'Name')


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ('id', 'Name', 'Company', 'Description', 'Type', 'Education', 'SalaryUp', 'SalaryDown', 'Longitude', 'Latitude')

class JobDetailSerializer(serializers.HyperlinkedModelSerializer):
    company = CompanySerializer(source='Company')

    class Meta:
        model = JobListing
        fields = ('id', 'Name', 'company', 'Description', 'Type', 'Education', 'SalaryUp', 'SalaryDown', 'Longitude', 'Latitude')

class JobMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatch
        fields = ('id', "JobListingId", "UserId", "PercentageMatch", "Status")


class JobMatchStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatch
        fields = ('id', "JobListingId", "Status")        

class JobSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListingSkills
        fields = ('id', "JobListingId", "SkillsId")


class SeekerSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerSkills
        fields = ('id', "UserId", "SkillsId")


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials")

