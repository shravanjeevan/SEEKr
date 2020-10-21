from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Company, Industry, Skills, SubIndustry, JobListing, JobMatch, JobListingSkills, JobSeekerSkills
from .models import JobSeekerDetails


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
        fields = ('id', 'username')


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'CompanyName', 'Location', "Description", 'IndustryId')


class JobSeekerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerDetails
        fields = ('id', 'UserId', 'Description', 'Education')


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ('id', 'IndustryName')


class SubIndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubIndustry
        fields = ('id', "IndustryId", 'SubIndustryName')


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ('id', 'SkillName')


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ('id', 'CompanyId', 'Description', 'JobTypeId', 'SalaryUp', 'SalaryDown')


class JobMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatch
        fields = ('id', "JobListingId", "UserId", "MatchStatus", "SubIndustryID")


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
