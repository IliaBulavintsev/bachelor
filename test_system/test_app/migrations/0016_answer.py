# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-28 21:05
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0015_question'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer_text', models.CharField(max_length=127)),
                ('answer_is_correct', models.BooleanField(default=False)),
                ('answer_to_question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='test_app.Question')),
            ],
        ),
    ]
