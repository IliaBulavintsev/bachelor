# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-28 20:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0012_auto_20160428_2041'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='question_answers',
            field=models.ManyToManyField(blank=True, related_name='answer_questions', to='test_app.Answer'),
        ),
    ]
