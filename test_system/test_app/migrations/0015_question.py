# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-28 21:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0014_auto_20160428_2103'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.TextField()),
                ('question_type', models.CharField(choices=[('V', 'Variable'), ('S', 'Single'), ('I', 'Input')], default='S', max_length=1)),
                ('question_for_test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='test_questions', to='test_app.Test')),
            ],
        ),
    ]
