# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-03 17:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0024_auto_20160430_1619'),
    ]

    operations = [
        migrations.AddField(
            model_name='testcomplete',
            name='correct_answers',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
