import pandas as pd
import random
import json
import os
import math
from string import punctuation

types = ['casual', 'full time', 'part time', 'internship', 'apprenticeship']

education = ['none', 'secondary', 'tertiary', 'postgraduate', 'masters', 'PhD']

fields = []
skills = []
with open('scripts\category.json') as f:
  categories = json.load(f)
  for field in categories:
      fields.append(field['name'])
      skills.extend(skill.strip(punctuation) for skill in field['children'])

def generate_candidate(i):
    # Candidates have: first name, last name, email, password, group (cluster), education and skills
    candidate = []
    candidate.append('c'+str(i)+' first name')
    candidate.append('c'+str(i)+' last name')
    candidate.append('c'+str(i)+'@email.com')
    candidate.append('password')
    candidate.append(0)
    candidate.append(random.sample(education, k=1)[0])
    lat, lon = generate_location()
    candidate.append(lat)
    candidate.append(lon)
    candidate.append(random.sample(skills, k=random.randint(1, 10)))
    return candidate


def generate_job(i):
    # Jobs have companies, names, salary ranges, types, skills and required education level
    job = []
    job.append('company ' + str(math.floor(i/10)))
    job.append('job '+str(i))
    salary = [random.random()*10000, random.random()*10000]
    job.append(max(salary))
    job.append(min(salary))
    lat, lon = generate_location()
    job.append(random.sample(types, k=1)[0])
    job.append(random.sample(education, k=1)[0])
    job.append(lat)
    job.append(lon)
    job.append(random.sample(skills, k=random.randint(1, 5)))
    return job

def generate_company(i):
    # Companies have names, locations, industries and description
    company = []
    company.append('company ' + str(math.floor(i/10)))
    company.append(random.sample(fields, k=1)[0])
    return company

# Function for generating random location point given radius
def generate_location ():
    # Base latitude and longitude (generate samples 30km from Sydney)
    y0 = -33.865143
    x0 = 151.209900
    radius = 30000
    rd = radius / 111300
    u = random.random()
    v = random.random()
    w = rd * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t)
    y = w * math.sin(t)
    xp = x / math.cos(y0)
    return y+y0, xp+x0

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
    jobs, columns=['company', 'name', 'salary_top', 'salary_bottom', 'type', 'education','latitude', 'longitude', 'skills'])

candidate_df = pd.DataFrame(
    candidates, columns=['first_name', 'last_name', 'email', 'password', 'group','education', 'latitude','longitude','skills'])

company_df = pd.DataFrame(companies, columns=['name', 'industry'])

job_df.to_csv('jobs.csv', index=False)
candidate_df.to_csv('candidates.csv', index=False)
company_df.to_csv('company.csv', index=False)
