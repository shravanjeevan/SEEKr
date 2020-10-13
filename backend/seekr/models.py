from django.db import models


# Create your models here.
class User(models.Model):
    UserName = models.CharField(max_length=20)
    FirstName = models.CharField(max_length=30)
    LastName = models.CharField(max_length=30)
    Email = models.CharField(max_length=50)
    Password = models.CharField(max_length=30)
    Group = models.CharField(max_length=30)


class JobSeekerDetails(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.CASCADE)
    Description = models.CharField(max_length=1000)
    Education = models.CharField(max_length=300)


class Industry(models.Model):
    IndustryName = models.CharField(max_length=40)


class Company(models.Model):
    CompanyName = models.CharField(max_length=50)
    Location = models.CharField(max_length=200)
    Description = models.CharField(max_length=200)
    IndustryId = models.ForeignKey(Industry, on_delete=models.CASCADE)


class SubIndustry(models.Model):
    SubIndustryName = models.CharField(max_length=40)
    IndustryId = models.ForeignKey(Industry, on_delete=models.CASCADE)


class JobType(models.Model):
    TypeName = models.CharField(max_length=20)


class JobListing(models.Model):
    CompanyId = models.ForeignKey(Company, on_delete=models.CASCADE)
    Description = models.CharField(max_length=1000)
    JobTypeId = models.ForeignKey(JobType, on_delete=models.CASCADE)
    SalaryUp = models.IntegerField()
    SalaryDown = models.IntegerField()


class Skills(models.Model):
    SkillName = models.CharField(max_length=40)


class JobListingSkills(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    SkillsId = models.ForeignKey(Skills, on_delete=models.CASCADE)


class JobSeekerSkills(models.Model):
    UserId = models.ForeignKey(User, on_delete=models.CASCADE)
    SkillsId = models.ForeignKey(Skills, on_delete=models.CASCADE)


class JobMatch(models.Model):
    JobListingId = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    UserId = models.ForeignKey(User, on_delete=models.CASCADE)
    MatchStatus = models.CharField(max_length=50)
    SubIndustryID = models.ForeignKey(SubIndustry, on_delete=models.CASCADE)
