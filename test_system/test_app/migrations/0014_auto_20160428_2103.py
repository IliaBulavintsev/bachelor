# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-28 21:03
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0013_auto_20160428_2043'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='question_answers',
        ),
        migrations.RemoveField(
            model_name='question',
            name='question_for_test',
        ),
        migrations.DeleteModel(
            name='Answer',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
    ]