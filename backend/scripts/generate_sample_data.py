import pandas as pd
import random

types = ['casual', 'full time', 'part time', 'internship', 'apprenticeship']

field = ['business', 'science', 'engineering', 'law', 'arts', 'journalism']

education = ['none', 'secondary', 'tertiary',
             'masters', 'PhD', 'apprenticeship', 'MBA']

skills = ['language proficiency', 'maths', 'law', 'programming', 'writing', 'management', 'research', 'databases',
          'communication', 'presentation', 'marketing', 'creativity', 'persuasion', 'animation', 'journalism', 'leadership']


def generate_candidate(i):
    candidate = []
    candidate.append('candidate '+str(i))
    candidate.append(random.sample(types, k=1))
    candidate.append(random.sample(field, k=1))
    candidate.append(random.sample(education, k=1))
    candidate.append(random.sample(skills, k=random.randint(1, 5)))
    return candidate


def generate_job(i):
    job = []
    job.append('company ' + str(i % 10))
    job.append('job '+str(i))
    job.append(random.sample(types, k=1))
    job.append(random.sample(field, k=1))
    job.append(random.sample(education, k=1))
    job.append(random.sample(skills, k=random.randint(1, 5)))
    return job


candidates = []
jobs = []

n = int(input("number to generate: "))

for i in range(0, n):
    candidates.append(generate_candidate(i))
    jobs.append(generate_job(i))

job_df = pd.DataFrame(
    jobs, columns=['company', 'name', 'type', 'field', 'education', 'skills'])

candidate_df = pd.DataFrame(
    candidates, columns=['name', 'type', 'field', 'education', 'skills'])

job_df.to_csv('jobs.csv', index=False)
candidate_df.to_csv('candidates.csv', index=False)
