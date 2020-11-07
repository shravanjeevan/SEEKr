import django
import json
import os
import ast
import pandas as pd
from string import punctuation

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth.models import User
from seekr.models import Company, Skills, JobListing, JobListingSkills, JobSeekerSkills, JobSeekerDetails

# Load Raw Data
jobs = pd.read_csv('jobs.csv')
candidates = pd.read_csv('candidates.csv')
companies = pd.read_csv('company.csv')
skills = set()
with open(os.path.join('./', 'scripts', 'category.json')) as f:
  categories = json.load(f)
  for industry in categories:
      for skill in industry['children']:
          skills.add(skill.strip(punctuation))
job_types = ['casual', 'full time', 'part time', 'internship', 'apprenticeship']

### Fill models ###
# Clear current models
JobSeekerSkills.objects.all().delete()
JobListingSkills.objects.all().delete()
JobSeekerDetails.objects.all().delete()
JobListing.objects.all().delete()
Company.objects.all().delete()
Skills.objects.all().delete()
User.objects.all().delete()

# Load Skills
for s in skills:
    Skills(Name=s).save()

# Load companies (link to industries)
for index, row in companies.iterrows():
    Company(Name=row['name'], Industry=row['industry']).save()

# Load jobs (link to companies, skills)
for index, row in jobs.iterrows():
    c_key = Company.objects.get(Name=row['company'])
    if c_key is not None:
        j = JobListing.objects.create(Name=row['name'], SalaryUp=row['salary_top'], SalaryDown=row['salary_bottom'], Company=c_key, Type=row['type'], Education=row['education'], Latitude=row['latitude'], Longitude=row['longitude'])
        j.save()
        for skill in ast.literal_eval(row['skills']):
            skill_key = Skills.objects.get(Name=skill)
            if skill_key is not None:
                JobListingSkills(JobListingId=j, SkillsId=skill_key).save()

# Load candidates (link to skills and users)
for index, row in candidates.iterrows():
    # Username cannot contain spaces
    uname = row['first_name'].replace(" ", "")
    u = User.objects.create(username=uname, password=row['password'], email=row['email'], first_name=row['first_name'], last_name=row['last_name'])
    u.save()
    JobSeekerDetails(UserId=u, Education=row['education'], Latitude=row['latitude'], Longitude=row['longitude']).save()
    for skill in ast.literal_eval(row['skills']):
        skill_key = Skills.objects.get(Name=skill)
        if skill_key is not None:
            JobSeekerSkills(UserId=u, SkillsId=skill_key).save()

