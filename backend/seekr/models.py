from django.db import models
from django.contrib.auth.models import User


class JobSeekerDetails(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    Description = models.CharField(max_length=1000, null=True, blank=True)
    Education = models.CharField(max_length=300, null=True, blank=True)


class Industry(models.Model):
    IndustryName = models.CharField(max_length=40, null=True, blank=True)


class Company(models.Model):
    CompanyName = models.CharField(max_length=200, null=True, blank=True)
    Location = models.CharField(max_length=200, null=True, blank=True)
    Description = models.CharField(max_length=500, null=True, blank=True)
    IndustryId = models.ForeignKey(Industry, on_delete=models.DO_NOTHING)


class SubIndustry(models.Model):
    SubIndustryName = models.CharField(max_length=200, null=True, blank=True)
    IndustryId = models.ForeignKey(Industry, on_delete=models.DO_NOTHING)


class JobType(models.Model):
    TypeName = models.CharField(max_length=20, null=True, blank=True)


class JobListing(models.Model):
    CompanyId = models.ForeignKey(Company, on_delete=models.DO_NOTHING, null=True, blank=True)
    Description = models.CharField(max_length=1000, null=True, blank=True)
    JobTypeId = models.ForeignKey(JobType, on_delete=models.CASCADE, null=True, blank=True)
    SalaryUp = models.IntegerField(null=True, blank=True)
    SalaryDown = models.IntegerField(null=True, blank=True)


class Skills(models.Model):
    SkillName = models.CharField(max_length=100, null=True, blank=True)


class JobListingSkills(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.DO_NOTHING)
    SkillsId = models.ForeignKey(Skills, on_delete=models.DO_NOTHING)


class JobSeekerSkills(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    SkillsId = models.ForeignKey(Skills, on_delete=models.DO_NOTHING)


class JobMatch(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.DO_NOTHING)
    UserId = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    MatchStatus = models.IntegerField(null=True, blank=True)
    SubIndustryID = models.ForeignKey(SubIndustry, on_delete=models.DO_NOTHING)
