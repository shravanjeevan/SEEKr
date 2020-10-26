from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Skills, JobListing, JobMatch, JobListingSkills, JobSeekerSkills
from django.contrib.auth import authenticate
from .models import JobSeekerDetails

import pandas as pd
import numpy as np

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
        fields = ('id', 'Name', "Description", 'Industry')


class JobSeekerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerDetails
        fields = ('id', 'UserId', 'Description', 'Education', 'Longitutde', 'Latitude')


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ('id', 'Name')


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ('id', 'Name', 'CompanyId', 'Description', 'Type', 'Education', 'SalaryUp', 'SalaryDown', 'Longitude', 'Latitude')


class JobMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatch
        fields = ('id', "JobListingId", "UserId", "Status")


class JobSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListingSkills
        fields = ('id', "JobListingId", "SkillsId")


class SeekerSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerSkills
        fields = ('id', "UserId", "SkillsId")

class MatchListSerializer (serializers.ModelSerializer):
    class Meta:
        job_skill_mat = generateJobSkillMat()

    def generateJobSkillMat(self):
        incidence = pd.DataFrame.from_records(JobListingSkills.objects.values_list('SkillsId_id', 'JobListingId_id'), columns=['skills', 'jobs'])
        incidence['weight'] = 1
        skill_ids = np.unique(incidence[['skills']])
        job_ids = np.unique(incidence[['jobs']])
        job_skill_mat = pd.DataFrame(0, index=job_ids, columns=skill_ids)
        f = job_skill_mat.index.get_indexer
        job_skill_mat.values[f(incidence.jobs), f(incidence.skills)] = incidence.weight.values
        job_skill_mat['sum'] = job_skill_mat.sum(axis=1)
        return job_skill_mat
    
    def generateMatchList(self, User):
        # Function should take user id as input and return dataframe of job listings annotated with % match
        seeker_skills = list(JobSeekerSkills.objects.get(UserId=User).values_list('SkillsId_id', flat=True))
        # Sum only skills shared with the seeker
        mat = self.job_skill_mat
        mat['matching'] = mat[seeker_skills].sum(axis=1)
        # Calculate % Match
        mat['percentage'] = mat['matching']/mat['sum']
        mat['job_id'] = mat.index
        return mat['job_id','percentage'].sort_values(by='percentage', ascending=False)
    
    def getFeedbackData(self, User):
        # Function should take user id as input and return dataframe of job_id, difference in skills, matching skills and total skills
        # To be used by different function to generate feedback
        seeker_skills = list(JobSeekerSkills.objects.get(UserId=User).values_list('SkillsId_id', flat=True))
        # Sum only skills shared with the seeker
        mat = self.job_skill_mat
        mat['matching'] = mat[seeker_skills].sum(axis=1)
        # Calculate difference (for feedback)
        mat['difference'] = mat['sum']/mat['matching']
        mat['job_id'] = mat.index
        return mat['job_id', 'difference', 'matching', 'sum']
    
    def generateFeedback(self, User, JobListing):
        mat = getFeedBackData(User)
        JobListingId = set(JobListingSkills.objects.get(JobListing=JobListing).values_list('JobListingId_id', flat=True))
        user_skills = len(list(JobSeekerSkills.objects.get(UserId=User).values_list('SkillsId_id', flat=True)))
        feedback = "%s has %d skills, %s has %d skills. That's %d matched, and %d skills missing." % (User.first_name, user_skills, JobListing.Name, mat.loc[JobListingId, 'sum'], mat.loc[JobListingId, 'matching'], mat.loc[JobListingId, 'difference'])
        return feedback


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials")
