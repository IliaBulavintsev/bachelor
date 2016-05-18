"""test_system URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from test_app import views as test_app_views
from django.conf import settings

#only dev!!!!!!!!!!!!!

from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

#

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^logout/$', test_app_views.log_out, name='log_out'),
    url(r'^login/$', test_app_views.log_in, name='log_in'),
    url(r'^addsubjectajax/$', test_app_views.add_subject_ajax, name='add_subject_ajax'),
    url(r'^addtestajax/$', test_app_views.add_test_ajax, name='add_test_ajax'),
    url(r'^delsubjectajax/$', test_app_views.del_subject_ajax, name='del_subject_ajax'),
    url(r'^editsubjectajax/$', test_app_views.edit_subject_ajax, name='edit_subject_ajax'),
    url(r'^test/(?P<id>[0-9]+)/$', test_app_views.test, name='test'),
    url(r'^addnewfile/$', test_app_views.add_new_file, name='add_new_file'),
    url(r'^statuschange/$', test_app_views.status_change, name='status_change'),
    url(r'^delfile/$', test_app_views.del_file, name='del_file'),
    url(r'^rangs/$', test_app_views.rangs, name='rangs'),
    url(r'^nums/$', test_app_views.nums, name='nums'),
    url(r'^del_test/$', test_app_views.del_test, name='del_test'),
    url(r'^generate_test_for/(?P<id>[0-9]+)/(?P<pk>[0-9]+)/$', test_app_views.generate_test, name='generate_test'),
    url(r'^complete_test/$', test_app_views.complete_test, name='complete_test'),
    url(r'^times/$', test_app_views.times, name='times'),
    url(r'^watch_complete/(?P<id>[0-9]+)/$', test_app_views.watch_complete, name='watch_complete'),
    url(r'^watch/(?P<id>[0-9]+)/$', test_app_views.watch, name='watch'),
    url(r'^$', test_app_views.index, name='index'),

]
#only dev!
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()