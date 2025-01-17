# Generated by Django 3.1.2 on 2020-11-09 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seekr', '0013_auto_20201109_1631'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='joblisting',
            name='City',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='State',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='Street',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='StreetNumber',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='Suburb',
        ),
        migrations.RemoveField(
            model_name='jobseekerdetails',
            name='City',
        ),
        migrations.RemoveField(
            model_name='jobseekerdetails',
            name='State',
        ),
        migrations.RemoveField(
            model_name='jobseekerdetails',
            name='Street',
        ),
        migrations.RemoveField(
            model_name='jobseekerdetails',
            name='StreetNumber',
        ),
        migrations.RemoveField(
            model_name='jobseekerdetails',
            name='Suburb',
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Latitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='Longitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='jobseekerdetails',
            name='Latitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='jobseekerdetails',
            name='Longitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
    ]
