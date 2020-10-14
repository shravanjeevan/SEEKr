import pandas as pd
import random
import json
import os
import math

types = ['casual', 'full time', 'part time', 'internship', 'apprenticeship']

education = ['none', 'secondary', 'tertiary',
             'masters', 'PhD', 'apprenticeship', 'MBA']

fields = []
skills = []
with open('backend\scripts\category.json') as f:
  categories = json.load(f)
  for field in categories:
      fields.append(field['name'])
      skills.extend(field['children'])

def generate_candidate(i):
    # Candidates have: first name, last name, email, password, group (cluster), education and skills
    candidate = []
    candidate.append('c'+str(i)+' first name')
    candidate.append('c'+str(i)+' last name')
    candidate.append('c'+str(i)+'@email.com')
    candidate.append('password')
    candidate.append(0)
    candidate.append(random.sample(education, k=1))
    candidate.append(random.sample(skills, k=random.randint(1, 5)))
    return candidate


def generate_job(i):
    # Jobs have companies, names, salary ranges, types, skills and required education level
    job = []
    job.append('company ' + str(math.floor(i/10)))
    job.append('job '+str(i))
    salary = [random.random()*10000, random.random()*10000]
    job.append(max(salary))
    job.append(min(salary))
    job.append(random.sample(types, k=1))
    job.append(random.sample(education, k=1))
    job.append(random.sample(skills, k=random.randint(1, 5)))
    return job

def generate_company(i):
    # Companies have names, locations, industries and description
    company = []
    company.append('company ' + str(math.floor(i/10)))
    company.append('company ' + str(math.floor(i/10)) + ' location')
    company.append(random.sample(fields, k=1))
    return company

candidates = []
jobs = []
companies = []

n = int(input("number to generate: "))

for i in range(0, n):
    candidates.append(generate_candidate(i))
    jobs.append(generate_job(i))
    if (i % 10 == 0):
        companies.append(generate_company(i))

job_df = pd.DataFrame(
    jobs, columns=['company', 'name', 'salary_top', 'salary_bottom', 'field', 'education', 'skills'])

candidate_df = pd.DataFrame(
    candidates, columns=['first_name', 'last_name', 'email', 'password', 'group','education', 'skills'])

company_df = pd.DataFrame(companies, columns=['name', 'location', 'industry'])

job_df.to_csv('jobs.csv', index=False)
candidate_df.to_csv('candidates.csv', index=False)
company_df.to_csv('company.csv', index=False)