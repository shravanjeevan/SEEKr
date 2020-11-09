from django.db import models
from django.contrib.auth.models import User



class JobSeekerDetails(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    Latitude = models.DecimalField(max_digits=15, decimal_places=10, null=True, blank=True)
    Longitude = models.DecimalField(max_digits=15, decimal_places=10, null=True, blank=True)
    Description = models.CharField(max_length=1000, null=True, blank=True)
    Education = models.CharField(max_length=300, null=True, blank=True)

class Company(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    Name = models.CharField(max_length=200, null=True, blank=True)
    Description = models.CharField(max_length=500, null=True, blank=True)
    Industry = models.CharField(max_length=40, null=True, blank=True)


class JobListing(models.Model):
    Name = models.CharField(max_length=20, null=True, blank=True)
    Company = models.ForeignKey(Company, on_delete=models.DO_NOTHING, null=True, blank=True)
    Description = models.CharField(max_length=1000, null=True, blank=True)
    SalaryUp = models.IntegerField(null=True, blank=True)
    SalaryDown = models.IntegerField(null=True, blank=True)
    Type = models.CharField(max_length=20, null=True, blank=True)
    Education = models.CharField(max_length=300, null=True, blank=True)
    Latitude = models.DecimalField(max_digits=15, decimal_places=10, null=True, blank=True)
    Longitude = models.DecimalField(max_digits=15, decimal_places=10, null=True, blank=True)

class Skills(models.Model):
    Name = models.CharField(max_length=100, null=True, blank=True)


class JobListingSkills(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.DO_NOTHING)
    SkillsId = models.ForeignKey(Skills, on_delete=models.DO_NOTHING)


class JobSeekerSkills(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    SkillsId = models.ForeignKey(Skills, on_delete=models.DO_NOTHING)

class NLPClusters(models.Model):
    ClusterId = models.DecimalField(max_digits=4, decimal_places=0, null=True, blank=True)
    NormSize = models.DecimalField(max_digits=10, decimal_places=9, null=True, blank=True)

class JobListingGroups(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.DO_NOTHING)
    ClusterId = models.ForeignKey(NLPClusters, on_delete=models.DO_NOTHING)

class JobSeekerGroups(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    ClusterId = models.ForeignKey(NLPClusters, on_delete=models.DO_NOTHING)

class JobMatch(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    PercentageMatch = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    Status = models.IntegerField(null=True, blank=True)
