import django
import os
import pandas as pd
import numpy as np

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth.models import User
from seekr.models import *

# Retrieve all job listings and set up natural language processing of job descriptions
JobListing_df = pd.DataFrame.from_records(JobListing.objects.values_list('Name', 'Description'), columns=['id', 'description'])
JobSeekerDetails_df = pd.DataFrame.from_records(JobSeekerDetails.objects.values_list('UserId_id', 'Description'), columns=['id', 'description'])
df = pd.concat([JobListing_df, JobSeekerDetails_df], ignore_index=True)

# vectorise descriptions using tfidf
from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = TfidfVectorizer()
x = vectorizer.fit_transform(df['description'])
df_wrds = pd.DataFrame(x.toarray(), columns=vectorizer.get_feature_names())

# Use pca to reduce dimensionality of data set
from sklearn.decomposition import PCA
pca = PCA()
df_pca = pca.fit_transform(df_wrds)
explained_var = pca.explained_variance_ratio_.cumsum()
features_over_90_var = len(explained_var[explained_var >= .90])
necessary_features = df_wrds.shape[0] - features_over_90_var
# Reducing the dataset to lower number of features 
pca = PCA(n_components=necessary_features)
# Fitting and transforming the dataset to the stated number of features and creating a new DF
df_pca = pca.fit_transform(df_wrds)

# Test different cluster settings
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
db_scores = []
s_scores = []
# Test different clustering amounts
for i in range(10, 30):
    model = KMeans(n_clusters=i)
    model.fit(df_pca)
    clusters = model.labels_
    s_scores.append(silhouette_score(df_pca, clusters))
    db_scores.append(davies_bouldin_score(df_pca, clusters))

# Print scores to find ideal cluster
xlabels = [*range(10,30,2)]
import matplotlib.pyplot as plt
fig, axs = plt.subplots(2)
fig.suptitle('Cluster Evaluation Scores')
axs[0].plot(s_scores)
axs[0].set_ylabel('Silhouette Score')
axs[0].set_xticklabels(xlabels)
axs[1].plot(db_scores)
axs[1].set_xlabel('Number of Clusters')
axs[1].set_xticklabels(xlabels)
axs[1].set_ylabel('Davies-Boudin Score')
plt.show()
# Fitting using user specified ideal cluster (highest s_score, lowest db_score)
n = int(input("Input ideal number of clusters. Should be highest silhouette score for lowest davies boudin score: "))
model = KMeans(n_clusters=n)
model.fit(df_pca)
clusters = model.labels_
df['cluster'] = clusters

# Fill database models
JobListingGroups.objects.all().delete()
JobSeekerGroups.objects.all().delete()
NLPClusters.objects.all().delete()

# Fill NLPClusters model. ClusterId is index, NormSize is normalised size of cluster
for index, value in df['cluster'].value_counts(normalize=True).items():
    NLPClusters.objects.create(ClusterId=index, NormSize=value).save()

# Fill group index table models
for index, row in df.iterrows():
    if row['id'] in JobListing_df['id'].values:
        j = JobListing.objects.get(Name=row['id'])
        g = NLPClusters.objects.get(ClusterId=row['cluster'])
        JobListingGroups.objects.create(JobListingId=j, ClusterId=g).save()
    elif row['id'] in JobSeekerDetails_df['id'].values:
        u = User.objects.get(id=row['id'])
        g = NLPClusters.objects.get(ClusterId=row['cluster'])
        JobSeekerGroups.objects.create(UserId=u, ClusterId=g).save()
