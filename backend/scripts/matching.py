# File for basic matching, filtering and percentage match algorithm
# Not yet connected to database or any of the front end applications
import pandas as pd
import os
import ast

jobs = pd.read_csv('jobs.csv')
candidates = pd.read_csv('candidates.csv')

# Retrieve random seeker
seeker = candidates.sample()


# Retrieve list of all available skills
all_skills = set() 
for skills in jobs['skills']:
    s_list = ast.literal_eval(skills)
    all_skills.update(s_list)

for skills in candidates['skills']:
    s_list = ast.literal_eval(skills)
    all_skills.update(s_list)

# Create job-skill matrix
job_skill_mat = pd.DataFrame(columns=all_skills, index=jobs['name'].tolist())
for index, job in jobs.iterrows():
     for skill in ast.literal_eval(job['skills']):
        job_skill_mat.loc[job['name'], skill] = 1

job_skill_mat = job_skill_mat.fillna(0)
job_skill_mat['sum'] = job_skill_mat.sum(axis=1)

# Sum only skills shared with the seeker
seeker_skills = ast.literal_eval(seeker['skills'].tolist()[0])
job_skill_mat['matching'] = job_skill_mat[seeker_skills].sum(axis=1)
# Calculate % Match
job_skill_mat['percentage'] = job_skill_mat['matching']/job_skill_mat['sum']
# Print in descending order
print(job_skill_mat.sort_values(by='percentage', ascending=False))
