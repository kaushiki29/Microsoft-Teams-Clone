from django.urls import path

from . import views

urlpatterns = [
    path('create_team',views.create_team,name='create_team'),
    path('join_team', views.join_team, name='join_team'),
    path('get_teams', views.get_teams, name='get_teams'),
    path('check_permissions', views.check_permissions, name='check_permissions'),
    path('invite_member', views.invite_member, name='invite_member'),
    path('get_users', views.get_users, name='get_users'),
]
