# Generated by Django 3.1.2 on 2020-11-06 23:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seekr', '0007_company_userid'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobmatch',
            name='PercentageMatch',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
    ]