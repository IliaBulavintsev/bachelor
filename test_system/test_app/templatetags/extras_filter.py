from django import template
from test_app.models import *
register = template.Library()


@register.filter(name='mark')
def mark(mod, arg):
    new = mod.get(test=arg)
    return new.mark


@register.filter(name='rang')
def rang(mod, arg):
    new = mod.get(test=arg)
    return new.rang


@register.filter(name='pk_to_str')
def pk_to_str(mod):
    return str(mod)


@register.filter(name='pk_in_str')
def pk_in_str(mod, arg):
    list_arg = arg.split(',')
    print(list_arg)
    print(str(mod))
    return str(mod) in list_arg