from django.db import models
from django.contrib.auth.models import User, UserManager
import xlrd
from django.utils.timezone import now
from transliterate import translit, get_available_language_codes
# Create your models here.


class Flow(models.Model):
    flow_index = models.IntegerField(unique=True, default=0)

    def __str__(self):
        return "Поток: " + str(self.flow_index)


class Group(models.Model):
    group_index = models.IntegerField(unique=True)
    group_from_flow = models.ForeignKey('Flow', on_delete=models.CASCADE)

    def __str__(self):
        return "Группа: " + str(self.group_index) + " поток: " + str(self.group_from_flow)


class Profile(models.Model):
    WHO_IS_LIST = (
        ('T', 'Teacher'),
        ('S', 'Student'),
        ('A', 'Administrator'),
    )
    profile_user = models.OneToOneField(User, related_name='profile')
    profile_group = models.ForeignKey(Group, blank=True, null=True, on_delete=models.CASCADE)
    profile_permissions = models.CharField(max_length=1, choices=WHO_IS_LIST, default='S')

    def __str__(self):
        return "Права: " + str(self.profile_permissions) + " Фамилия: " + str(self.profile_user.last_name) + " Имя: " + str(self.profile_user.first_name)


class Subject(models.Model):
    subject_name = models.CharField(max_length=15)
    subject_tutor = models.ForeignKey(Profile, blank=True, null=True, on_delete=models.SET_NULL, related_name='subjects_tutors')
    subject_flow = models.ForeignKey(Flow, blank=True, null=True, on_delete=models.SET_NULL, related_name='subjects_flow')
    translit = models.CharField(max_length=15, blank=True, null=True)

    def transliting(self):
        self.translit = translit(self.subject_name, 'ru', reversed=True)


class Question(models.Model):
    TYPE_QUESTION = (
        ('V', 'Variable'),
        ('S', 'Single'),
        ('I', 'Input'),
    )
    question_text = models.TextField()
    question_for_test = models.ForeignKey('Test', on_delete=models.CASCADE, related_name='test_questions')
    question_type = models.CharField(max_length=1, choices=TYPE_QUESTION, default='S')


class Answer(models.Model):
    answer_text = models.CharField(max_length=512)
    answer_is_correct = models.BooleanField(blank=True, default=False)
    answer_to_question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='answers')


def test_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return '{0}/{1}'.format(instance.test_subject.translit, filename)


class Test(models.Model):
    test_name = models.CharField(max_length=20)
    test_subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='tests')
    test_num_select = models.IntegerField(blank=True, null=True)
    test_file = models.FileField(upload_to=test_directory_path, blank=True, null=True)
    test_is_active = models.BooleanField(blank=True, default=False)
    test_2 = models.IntegerField(blank=True, null=True)
    test_3 = models.IntegerField(blank=True, null=True)
    test_4 = models.IntegerField(blank=True, null=True)
    test_time = models.IntegerField(blank=True, null=True)

    def check_file(self):
        if self.test_file:
            return True
        else:
            return False

    def get_absolute_url(self):
        print('.{0}'.format(self.test_file.url))
        return '.{0}'.format(self.test_file.url)

    def get_url_to_del(self):
        print('{0}'.format(self.test_file.url))
        return '{0}'.format(self.test_file.url)

    def rang_set_null(self):
        self.test_2 = 0
        self.test_3 = 0
        self.test_4 = 0
        self.test_num_select = 0
        self.test_time = 0

    def pre_load(self):
        rb = xlrd.open_workbook(self.get_absolute_url(), formatting_info=True)
        sheet = rb.sheet_by_index(0)
        buf_pk = 0
        for rownum in range(sheet.nrows):
            if sheet.cell(rownum, 0).value:
                question = Question(question_text=sheet.cell(rownum, 0).value, question_for_test=self, question_type=sheet.cell(rownum, 1).value)
                question.save()
                buf_pk = question.pk
                continue
            else:
                status = sheet.cell(rownum, 2).value
                if status == '+':
                    status = True
                else:
                    status = False
                value = sheet.cell(rownum, 1).value
                if type(value) is float:
                    if value == int(value):
                        value = int(value)
                answer = Answer(answer_text=value, answer_is_correct=status, answer_to_question=Question.objects.get(pk=buf_pk))
                answer.save()

    def is_complete(self, user):
        test_complete = TestComplete.objects.filter(student=user)
        test_complete.get(test=self.pk)
        if test_complete:
            return True
        else:
            return False


class TestComplete(models.Model):
    test = models.ForeignKey(Test, blank=True, null=True, on_delete=models.CASCADE)
    student = models.ForeignKey(Profile, blank=True, null=True)
    rang = models.IntegerField(blank=True, null=True)
    correct_answers = models.IntegerField(blank=True, null=True)
    data = models.DateTimeField(default=now)
    num_select = models.IntegerField(blank=True, null=True)
    mark = models.IntegerField(blank=True, null=True)

    def create(self, test, user, num):
        self.student = user
        self.test = test
        self.num_select = num
        self.save()


class TestSelection(models.Model):
    test_complete = models.ForeignKey(TestComplete)
    question = models.ForeignKey(Question)
    student_answer = models.CharField(max_length=127, blank=True, null=True)
    is_correct = models.BooleanField(blank=True, default=False)


def identification(questions):
    result = 0
    for question in questions:
        if question.question.question_type == 'I':
            answer = Answer.objects.get(answer_to_question=question.question.pk)
            if str(answer.answer_text) == str(question.student_answer):
                question.is_correct = True
                question.save()
                result += 1
        elif question.question.question_type == 'S':
            answer = Answer.objects.filter(answer_to_question=question.question.pk).get(answer_is_correct=True)
            if str(answer.pk) == str(question.student_answer):
                question.is_correct = True
                question.save()
                result += 1
        else:
            buf = True
            list_of_answers = question.student_answer.split(',')
            answers = Answer.objects.filter(answer_to_question=question.question.pk).filter(answer_is_correct=True)
            for answer in answers:
                if str(answer.pk) not in list_of_answers:
                    buf = False
                    break
                else:
                    list_of_answers.remove(str(answer.pk))
            if len(list_of_answers) > 0:
                buf = False
            question.is_correct = buf
            question.save()
            if buf:
                result += 1
    return result


def rang(pk, questions):
    test_complete = TestComplete.objects.get(pk=pk)
    test_complete.correct_answers = identification(questions)
    test_complete.save()
    test_complete.rang = (test_complete.correct_answers / test_complete.num_select) * 100
    test_complete.save()
    test = Test.objects.get(pk=test_complete.test.pk)
    r = test_complete.rang
    if r < test.test_2:
        test_complete.mark = 2
        test_complete.save()
    elif r < test.test_3:
        test_complete.mark = 3
        test_complete.save()
    elif r < test.test_4:
        test_complete.mark = 4
        test_complete.save()
    else:
        test_complete.mark = 5
        test_complete.save()