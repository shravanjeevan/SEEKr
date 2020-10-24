import django
import os
import pandas as pd
import numpy as np
import time
start = time.time()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth.models import User
from seekr.models import Company, Skills, JobListing, JobListingSkills, JobSeekerSkills, JobSeekerDetails

# Create skill/job adjacency matrix
incidence = pd.DataFrame.from_records(JobListingSkills.objects.values_list('SkillsId_id', 'JobListingId_id'), columns=['skills', 'jobs'])
incidence['weight'] = 1
print(incidence)
skill_ids = np.unique(incidence[['skills']])
job_ids = np.unique(incidence[['jobs']])
job_skill_mat = pd.DataFrame(0, index=job_ids, columns=skill_ids)
f = job_skill_mat.index.get_indexer
job_skill_mat.values[f(incidence.jobs), f(incidence.skills)] = incidence.weight.values
job_skill_mat['sum'] = job_skill_mat.sum(axis=1)
exit()
# Sum only skills shared with the seeker
job_skill_mat['matching'] = job_skill_mat['test'].sum(axis=1)
# Calculate % Match
job_skill_mat['percentage'] = job_skill_mat['matching']/job_skill_mat['sum']
# Calculate difference (for feedback)
job_skill_mat['difference'] = job_skill_mat['sum'] - job_skill_mat['matching']
