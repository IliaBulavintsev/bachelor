from django.core.management.base import BaseCommand

# Python
from random import randint

from test_app.models import *

def create_teacher(start, stop):
    for x in range(start, stop, 1):
        try:
            username = 'teacher_'+str(x)
            first = 'teacher_first_name_'+str(x)
            last = 'teacher_last_name_'+str(x)
            password = '12345'
            permissions = 'T'
            user = User.objects.create_user(username=username, email=None, password=password, first_name=first, last_name=last)
            user.save()
            profile = Profile(profile_user=user, profile_permissions=permissions)
            profile.save()
        except Exception as e:
            print(e)
    print('teachers create!')

def create_students(start, stop):
    groups=Group.objects.all()
    groups_count=groups.count()
    for x in range(start, stop, 1):
        try:
            group=groups[randint(0, groups_count - 1)]
            username = 'student_{}_{}'.format(x, group.group_index)
            first = 'student_first_name_{}_{}'.format(x, group.group_index)
            last = 'student_last_name_{}_{}'.format(x, group.group_index)
            password = '12345'
            permissions = 'S'
            user = User.objects.create_user(username=username, email=None, password=password, first_name=first, last_name=last)
            user.save()
            profile = Profile(profile_user=user, profile_permissions=permissions, profile_group=group)
            profile.save()
        except Exception as e:
            print(e)
    print('Students create!')

def create_group(start, stop, flow):
    flows=Flow.objects.get(pk=flow)
    for x in range(start, stop, 1):
        try:
            group_indx = int('{}{}'.format(flows.flow_index, x))
            group = Group(group_index=group_indx, group_from_flow=flows)
            group.save()
        except Exception as e:
            print(e)
    print('Groups create!')

def create_flow(start, stop):
    for x in range(start, stop, 1):
        try:
            flow = Flow(x, flow_index=x)
            flow.save()
        except Exception as e:
            print(e)
    print('Flows create!')

def create_subject(start, stop):
    tutors = Profile.objects.filter(profile_permissions='T')
    tutors_count = tutors.count()
    flows = Flow.objects.all()
    flows_count = flows.count()
    for x in range(start, stop, 1):
        try:
            name = 'Subject_{}'.format(x)
            flow = flows[randint(0, flows_count - 1)]
            tutor = tutors[randint(0, tutors_count - 1)]
            subj = Subject(subject_name=name, subject_tutor=tutor, subject_flow=flow)
            subj.save()
        except Exception as e:
            print(e)
    print('Subjects create!')

def create_test(start, stop):
    subjects = Subject.objects.all()
    subjects_count = subjects.count()
    for x in range (start, stop, 1):
        try:
            name = 'Test_{}'.format(x)
            subj = subjects[randint(1, subjects_count - 1)]
            test = Test(test_name=name, test_subject=subj)
            test.save()
        except Exception as e:
            print(e)
    print('Tests create!')
    pass

class Command(BaseCommand):
    help = 'Initialize database'

    def handle(self, *args, **options):
        # create_flow(1, 4)
        # create_group(1, 4, 1)
        # create_group(1, 4, 2)
        # create_group(1, 4, 3)
        # create_teacher(1, 11)
        # create_students(1, 21)
        # create_subject(1, 11)
        create_test(1, 41)
        self.stdout.write('Successfully filled database!')