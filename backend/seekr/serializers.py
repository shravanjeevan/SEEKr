from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Company, Skills, JobListing, JobMatch, JobListingSkills, JobSeekerSkills
from .models import JobSeekerDetails

import pandas as pd
import numpy as np

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


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

    def generateList(self, User):
        seeker_skills = list(JobSeekerSkills.objects.get(UserId=User).values_list('SkillsId_id', flat=True))
        
        incidence = pd.DataFrame.from_records(JobListingSkills.objects.values_list('SkillsId_id', 'JobListingId_id'), columns=['skills', 'jobs'])
        incidence['weight'] = 1
        skill_ids = np.unique(incidence[['skills']])
        job_ids = np.unique(incidence[['jobs']])
        job_skill_mat = pd.DataFrame(0, index=job_ids, columns=skill_ids)
        f = job_skill_mat.index.get_indexer
        job_skill_mat.values[f(incidence.jobs), f(incidence.skills)] = incidence.weight.values
        job_skill_mat['sum'] = job_skill_mat.sum(axis=1)

        # Sum only skills shared with the seeker
        job_skill_mat['matching'] = job_skill_mat[seeker_skills].sum(axis=1)
        # Calculate % Match
        job_skill_mat['percentage'] = job_skill_mat['matching']/job_skill_mat['sum']
        # Calculate difference (for feedback)
        job_skill_mat['difference'] = job_skill_mat['sum'] - job_skill_mat['matching']

        return job_skill_mat






