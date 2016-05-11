from django.shortcuts import render, get_object_or_404
from django.contrib import *
from django.contrib.auth import *
from django.contrib.auth.views import *
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from django.http import Http404
from django.http import HttpResponse, JsonResponse
import json
import os
from test_system.settings import BASE_DIR

from test_app.models import *
from django.db.models import Count
from test_app.forms import *


def personal_student(request):
    subjects = Subject.objects.filter(subject_flow=request.user.profile.profile_group.group_from_flow).annotate(Count('tests'))
    complete = TestComplete.objects.filter(student=request.user.profile.pk)
    complete_list = []
    for com in complete:
        complete_list.append(com.test.test_name)
    print(complete_list)
    return render(request, 'yet_login.html', {'subjects': subjects, 'complete_list': complete_list, 'complete': complete})


def personal_teacher(request):
    subjects = Subject.objects.filter(subject_tutor=request.user.profile).annotate(Count('tests'))
    subjects_count = subjects.count()
    flows = Flow.objects.all()
    return render(request, 'yet_login.html', {'subjects': subjects, 'subjects_count': subjects_count, 'flows': flows})


def log_out(request):
    if request.method == "POST":
        if request.user.is_authenticated():
            logout(request)
            return HttpResponseRedirect('/')
        else:
            raise Http404
    else:
        raise Http404


def log_in(request):
    if request.method == "POST":
        if not request.user.is_authenticated():
            username = request.POST['username']
            password = request.POST['password']
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
                return HttpResponseRedirect('/')
            else:
                return render(request, 'index.html', {'error_login': 1})
        else:
            return HttpResponseRedirect('/')
    else:
        return HttpResponseRedirect('/')


def index(request):
    if request.user.is_authenticated():
        if request.user.profile.profile_permissions == 'S':
            return personal_student(request)
        if request.user.profile.profile_permissions == 'T':
            return personal_teacher(request)
    else:
        return render(request, 'index.html')


def add_subject_ajax(request):
    if request.method == 'POST':
        response_data = {}
        form = AddSubjectForm(data=request.POST)
        if form.is_valid():
            subj_name = form.cleaned_data['subject']
            subj_tutor = request.user.profile
            num_flow = request.POST.get('flow')
            subj_flow = Flow.objects.get(flow_index=int(num_flow))
            subject = Subject(subject_name=subj_name, subject_tutor=subj_tutor, subject_flow=subj_flow)
            subject.transliting()
            subject.save()
            response_data['status'] = 'ok'
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def add_test_ajax(request):
    if request.method == 'POST':
        response_data = {}
        form = AddTestForm(data=request.POST)
        if form.is_valid():
            name = form.cleaned_data['test_name']
            subj_name = request.POST.get('test_subject')
            subj = Subject.objects.get(subject_name=subj_name)
            test = Test(test_name=name, test_subject=subj)
            test.save()
            response_data['status'] = 'ok'
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def del_subject_ajax(request):
    if request.method == "POST":
        response_data = {}
        name = request.POST.get('del')
        if name:
            Subject.objects.get(subject_name=name).delete()
            response_data['status'] = 'ok'
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def edit_subject_ajax(request):
    if request.method == "POST":
        response_data = {}
        form = EditSubjectForm(data=request.POST)
        if form.is_valid():
            subj_name = form.cleaned_data['edit_subject']
            num_flow = request.POST.get('edit_flow')
            subj_flow = Flow.objects.get(flow_index=int(num_flow))
            subject = Subject.objects.get(subject_name=request.POST.get('old'))
            subject.subject_name =subj_name
            subject.subject_flow = subj_flow
            subject.save()
            response_data['status'] = 'ok'
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'bad'
            return JsonResponse(response_data)
    else:
        raise Http404


def test(request, id):
    if request.user.profile.profile_permissions == 'S':
        raise Http404
    else:
        tests = get_object_or_404(Test, pk=id)
        completes = TestComplete.objects.filter(test=tests).order_by('data')
        question_count = len(Question.objects.filter(question_for_test=tests))
        groups = Group.objects.filter(group_from_flow=tests.test_subject.subject_flow.pk).order_by('group_index')
        print(completes)
        return render(request, 'test.html', {'test': tests, 'questions': question_count, 'completes': completes, 'groups': groups})


def add_new_file(request):
    if request.method == "POST":
        response_data = {}
        tests = Test.objects.get(test_name=request.POST.get('test'))
        if tests.test_file:
            print('first del')
            question = Question.objects.filter(question_for_test=tests)
            question.delete()
            os.remove(BASE_DIR + tests.get_url_to_del())
            tests.test_file.delete()
        tests.test_file = request.FILES['file']
        tests.rang_set_null()
        tests.save()
        tests.pre_load()
        response_data['status'] = 'ok'
        return JsonResponse(response_data)

    else:
        raise Http404


def status_change(request):
    if request.method == "POST":
        response_data = {}
        tests = Test.objects.get(test_name=request.POST.get('test'))
        tests.test_is_active = not tests.test_is_active
        tests.save()
        response_data['status'] = 'ok'
        return JsonResponse(response_data)
    else:
        raise Http404


def del_file(request):
    if request.method == "POST":
        response_data = {}
        tests = Test.objects.get(pk=request.POST.get('test'))
        question = Question.objects.filter(question_for_test=tests)
        question.delete()
        os.remove(BASE_DIR + tests.get_url_to_del())
        tests.test_file.delete()
        tests.save()
        response_data['status'] = 'ok'
        return JsonResponse(response_data)
    else:
        raise Http404


def rangs(request):
    if request.method == "POST":
        response_data = {}
        tests = Test.objects.get(pk=request.POST.get('test'))
        tests.test_2 = request.POST.get('two')
        tests.test_3 = request.POST.get('three')
        tests.test_4 = request.POST.get('four')
        tests.save()
        response_data['status'] = 'ok'
        return JsonResponse(response_data)
    else:
        raise Http404


def nums(request):
    if request.method == "POST":
        response_data = {}
        tests = Test.objects.get(pk=request.POST.get('test'))
        tests.test_num_select = request.POST.get('num')
        tests.save()
        response_data['status'] = 'ok'
        return JsonResponse(response_data)
    else:
        raise Http404


def times(request):
    if request.method == "POST":
        response_data = {}
        tests = Test.objects.get(pk=request.POST.get('test'))
        tests.test_time = request.POST.get('time')
        tests.save()
        response_data['status'] = 'ok'
        return JsonResponse(response_data)
    else:
        raise Http404


def del_test(request):
    if request.method == "POST":
        tests = Test.objects.get(pk=request.POST.get('test'))
        if tests.check_file():
            os.remove(BASE_DIR + tests.get_url_to_del())
        tests.delete()
        return HttpResponseRedirect('/')
    else:
        raise Http404


def generate_test(request, id, pk):
    test = Test.objects.get(pk=pk)
    user = request.user.profile
    find = TestComplete.objects.filter(student=user.pk).filter(test=test.pk)
    if find:
        return HttpResponseRedirect('/')
    num = test.test_num_select
    complete = TestComplete()
    complete.save()
    complete.create(test, user, num)
    questions = Question.objects.filter(question_for_test=test).order_by('?')[:num]
    for questionsel in questions:
        select = TestSelection(test_complete=complete, question=questionsel)
        select.save()
    selects = TestSelection.objects.filter(test_complete=complete)
    complete_id = complete.pk
    time = test.test_time
    print(selects)
    return render(request, 'complete_test.html', {'selects': selects, 'complete': complete_id, 'time': time})


def complete_test(request):
    questions = TestSelection.objects.filter(test_complete=request.POST.get('complete'))
    for question in questions:
        answers = request.POST.getlist(str(question.question.pk))
        answ = ",".join(map(str, answers))
        question.student_answer = answ
        question.save()
    rang(request.POST.get('complete'), questions)
    return HttpResponseRedirect('/')


def watch_complete(request, id):
    if request.user.profile.profile_permissions == 'S':
        raise Http404
    else:
        complete = get_object_or_404(TestComplete, pk=id)
        selects = TestSelection.objects.filter(test_complete=complete)
        return render(request, 'watch_complete.html', {'selects': selects, 'complete': complete})