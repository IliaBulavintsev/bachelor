from django import forms

class AddSubjectForm(forms.Form):
    subject = forms.CharField(max_length=15)

class EditSubjectForm(forms.Form):
    edit_subject = forms.CharField(max_length=15)

class AddTestForm(forms.Form):
    test_name = forms.CharField(max_length=20)
