# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-14 10:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profile_permissions',
            field=models.CharField(choices=[('T', 'Teacher'), ('S', 'Student'), ('A', 'Administrator')], default='S', max_length=1),
        ),
    ]
