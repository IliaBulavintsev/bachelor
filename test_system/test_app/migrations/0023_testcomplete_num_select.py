# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-30 16:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0022_auto_20160430_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='testcomplete',
            name='num_select',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]