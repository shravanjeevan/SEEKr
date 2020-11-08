import django
import os
import pandas as pd
import numpy as np
import time
start = time.time()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth.models import User
from seekr.models import *

# Create skill/job adjacency matrix
incidence = pd.DataFrame.from_records(JobListingSkills.objects.values_list('SkillsId_id', 'JobListingId_id'), columns=['skills', 'jobs'])
incidence['weight'] = 1
skill_ids = np.unique(incidence[['skills']])
job_ids = np.unique(incidence[['jobs']])
job_skill_mat = pd.DataFrame(0, index=job_ids, columns=skill_ids)
for index, row in incidence.iterrows():
    job_skill_mat.loc[row['jobs'], row['skills']] = 1
job_skill_mat['sum'] = job_skill_mat.sum(axis=1)
# Get Seeker Skills
seeker = User.objects.get(username='test')
seeker_skills = list(JobSeekerSkills.objects.filter(UserId=seeker).values_list('SkillsId_id', flat=True))
# Sum only skills shared with the seeker
job_skill_mat['matching'] = job_skill_mat[seeker_skills].sum(axis=1)

# Add multiplier for matching NLP cluster
seeker_cluster = JobSeekerGroups.objects.get(UserId=seeker).ClusterId
shared_group = list(JobListingGroups.objects.filter(ClusterId=seeker_cluster).values_list('JobListingId_id', flat=True))
for job in shared_group:
    job_skill_mat.loc[job, 'shared'] = 1-float(seeker_cluster.NormSize)
job_skill_mat.fillna(0, inplace=True)
# Calculate % Match
job_skill_mat['percentage'] = job_skill_mat['matching']/job_skill_mat['sum']+job_skill_mat['shared']
job_skill_mat.fillna(0, inplace=True)
# Calculate difference (for feedback)
job_skill_mat['difference'] = job_skill_mat['sum'] - job_skill_mat['matching']
job_skill_mat['job_id'] = job_skill_mat.index
print(job_skill_mat)
print(job_skill_mat[['job_id', 'percentage']].sort_values(by='percentage', ascending=False))
