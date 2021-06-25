from django.urls import path

from . import views

urlpatterns = [
    path('create_call', views.create_call, name='create_call'),
    path('schedule_call', views.schedule_call, name='schedule_call'),
    path('get_calls', views.get_calls, name='get_calls'),
    path('check_permissions',views.check_permissions,name='check_permissions'),
    path('get_twilio_token',views.get_twilio_token,name='get_twilio_token'),
    path('init_chat',views.init_chat,name='init_chat'),
    path('get_thread_messages',views.get_thread_messages,name='get_thread_messages'),
    path('send_message',views.send_message,name='send_message'),
    path('get_all_threads',views.get_all_threads,name='get_all_threads'),
    path('test',views.test,name="test"),
]