from django.urls import path

from . import views

urlpatterns = [
    path('user_login', views.user_login, name='user_login'),
    path('signup', views.signup, name='signup'),
    #     path('admin_login',views.admin_login,name='admin_login'),
    path('logout', views.logout, name='logout'),
]
