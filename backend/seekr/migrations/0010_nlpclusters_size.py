# Generated by Django 3.1.2 on 2020-11-08 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seekr', '0009_joblistinggroups_jobseekergroup_nlpclusters'),
    ]

    operations = [
        migrations.AddField(
            model_name='nlpclusters',
            name='Size',
            field=models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True),
        ),
    ]