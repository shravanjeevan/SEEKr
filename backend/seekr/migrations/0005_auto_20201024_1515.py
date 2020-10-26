# Generated by Django 3.1.2 on 2020-10-24 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seekr', '0004_auto_20201013_0834'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subindustry',
            name='IndustryId',
        ),
        migrations.RenameField(
            model_name='company',
            old_name='CompanyName',
            new_name='Name',
        ),
        migrations.RenameField(
            model_name='joblisting',
            old_name='CompanyId',
            new_name='Company',
        ),
        migrations.RenameField(
            model_name='jobmatch',
            old_name='MatchStatus',
            new_name='Status',
        ),
        migrations.RenameField(
            model_name='skills',
            old_name='SkillName',
            new_name='Name',
        ),
        migrations.RemoveField(
            model_name='company',
            name='IndustryId',
        ),
        migrations.RemoveField(
            model_name='company',
            name='Location',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='JobTypeId',
        ),
        migrations.RemoveField(
            model_name='jobmatch',
            name='SubIndustryID',
        ),
        migrations.AddField(
            model_name='company',
            name='Industry',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Education',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Latitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Longitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Name',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Type',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='jobseekerdetails',
            name='Latitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='jobseekerdetails',
            name='Longitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=15, null=True),
        ),
        migrations.DeleteModel(
            name='Industry',
        ),
        migrations.DeleteModel(
            name='JobType',
        ),
        migrations.DeleteModel(
            name='SubIndustry',
        ),
    ]
