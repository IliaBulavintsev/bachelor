# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-03 22:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0026_testcomplete_mark'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='test_time',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]