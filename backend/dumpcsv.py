import django
import json
import os
import ast
import pandas as pd
from string import punctuation

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth.models import User
from seekr.models import *
print("loading Django models with sample data...")
# Load Raw Data
jobs = pd.read_csv('./jobs.csv')
candidates = pd.read_csv('./candidates.csv')
companies = pd.read_csv('./company.csv')
skills = set()
with open(os.path.join('./', 'scripts', 'category.json')) as f:
  categories = json.load(f)
  for industry in categories:
      for skill in industry['children']:
          skills.add(skill.strip(punctuation))
job_types = ['casual', 'full time', 'part time', 'internship', 'apprenticeship']

### Fill models ###
# Clear current models
print("... clearing models ...")
JobListingGroups.objects.all().delete()
JobSeekerGroups.objects.all().delete()
JobSeekerSkills.objects.all().delete()
JobListingSkills.objects.all().delete()
JobSeekerDetails.objects.all().delete()
JobListing.objects.all().delete()
Company.objects.all().delete()
Skills.objects.all().delete()
NLPClusters.objects.all().delete()
User.objects.all().delete()

print('... loading skills ..')
# Load Skills
for s in skills:
    if Skills.objects.filter(Name=s).exists():
        continue
    else:
        Skills(Name=s).save()

print ('... loading companies ...')
# Load companies (link to users)
for index, row in companies.iterrows():
    u = User.objects.create_user(username=row['username'], password=row['password'], email=row['email'], first_name=row['first_name'], last_name=row['last_name'])
    u.save()
    Company(UserId=u, Name=row['name'], Industry=row['industry']).save()

print ('... loading jobs ...')
# Load jobs (link to companies, skills)
for index, row in jobs.iterrows():
    if Company.objects.filter(Name=row['company']).exists():
        c_key = Company.objects.get(Name=row['company'])
        j = JobListing.objects.create(Name=row['name'], SalaryUp=row['salary_top'], SalaryDown=row['salary_bottom'], Company=c_key, Type=row['type'], Education=row['education'], Latitude=row['latitude'], Longitude=row['longitude'], Description=row['description'])
        j.save()
        for skill in ast.literal_eval(row['skills']):
            if Skills.objects.filter(Name=skill).exists():
                skill_key = Skills.objects.get(Name=skill)
                JobListingSkills(JobListingId=j, SkillsId=skill_key).save()

print('... loading candidates/JobSeekers ...')
# Load candidates (link to skills and users)
for index, row in candidates.iterrows():
    # Username cannot contain spaces
    uname = row['first_name'].replace(" ", "")
    u = User.objects.create_user(username=uname, password=row['password'], email=row['email'], first_name=row['first_name'], last_name=row['last_name'])
    u.save()
    JobSeekerDetails(UserId=u, Education=row['education'], Latitude=row['latitude'], Longitude=row['longitude'], Description=row['description']).save()
    for skill in ast.literal_eval(row['skills']):
        if Skills.objects.filter(Name=skill).exists():
            skill_key = Skills.objects.get(Name=skill)
            JobSeekerSkills(UserId=u, SkillsId=skill_key).save()

print('done')
