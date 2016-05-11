# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-30 16:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0020_auto_20160430_1553'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testcomplete',
            name='data',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='testcomplete',
            name='rang',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]