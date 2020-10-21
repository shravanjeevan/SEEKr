import django
import json
import os
import ast
import pandas as pd
from string import punctuation

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth.models import User
from seekr.models import Company, Industry, Skills, JobListing, JobListingSkills, JobSeekerSkills, JobType
from seekr.models import JobSeekerDetails

# Load Raw Data
jobs = pd.read_csv('jobs.csv')
candidates = pd.read_csv('candidates.csv')
companies = pd.read_csv('company.csv')
industries = set()
skills = set()
with open('scripts\category.json') as f:
  categories = json.load(f)
  for industry in categories:
      industries.add(industry['name'])
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
Industry.objects.all().delete()
JobType.objects.all().delete()
User.objects.all().delete()

# Load Skills
for s in skills:
    Skills(SkillName=s).save()

# Load Industries
for i in industries:
    Industry(IndustryName=i).save()

# Load job types
for jt in job_types:
    JobType(TypeName=jt).save()

# Load companies (link to industries)
for index, row in companies.iterrows():
    ind_key = Industry.objects.get(IndustryName=ast.literal_eval(row['industry'])[0])
    if ind_key is not None:
        Company(CompanyName=row['name'], Location=row['location'], IndustryId=ind_key).save()

# Load jobs (link to companies, skills)
for index, row in jobs.iterrows():
    c_key = Company.objects.get(CompanyName=row['company'])
    jt_key = JobType.objects.get(TypeName=ast.literal_eval(row['type'])[0])
    if c_key is not None and jt_key is not None:
        j = JobListing.objects.create(Description=row['name'], SalaryUp=row['salary_top'], SalaryDown=row['salary_bottom'], CompanyId=c_key, JobTypeId=jt_key)
        j.save()
        for skill in ast.literal_eval(row['skills']):
            skill_key = Skills.objects.get(SkillName=skill)
            if skill_key is not None:
                JobListingSkills(JobListingId=j, SkillsId=skill_key).save()

# Load candidates (link to skills and users)
for index, row in candidates.iterrows():
    u = User.objects.create(username=row['first_name'], password=row['password'], email=row['email'], first_name=row['first_name'], last_name=['last_name'])
    u.save()
    JobSeekerDetails(UserId=u, Education=row['education']).save()
    for skill in ast.literal_eval(row['skills']):
        skill_key = Skills.objects.get(SkillName=skill)
        if skill_key is not None:
            JobSeekerSkills(UserId=u, SkillsId=skill_key).save()

