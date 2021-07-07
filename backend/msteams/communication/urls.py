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
    path('get_scheduled_calls',views.get_scheduled_calls, name='get_scheduled_calls'),
    path('delete_call',views.delete_call, name='delete_call'),
    path('create_p2p_call',views.create_p2p_call,name='create_p2p_call'),
    path('get_p2p_twilio_token',views.get_p2p_twilio_token,name='get_p2p_twilio_token'),
    path('send_img',views.send_img,name='send_img'),
    path('get_unseen_count',views.get_unseen_count,name='get_unseen_count'),
    path('set_msg_seen',views.set_msg_seen,name='set_msg_seen'),
    path('send_team_msg',views.send_team_msg,name = 'send_team_msg'),
    path('send_team_img',views.send_team_img,name='send_team_img'),
    path('get_team_msg',views.get_team_msg,name='get_team_msg'),
    path('get_video_msg',views.get_video_msg,name='get_video_msg'),
    path('send_video_msg',views.send_video_msg,name='send_video_msg'),
    path('send_video_img',views.send_video_img, name='send_video_img'),
    path('get_meet_name', views.get_meet_name, name='get_meet_name')
]
