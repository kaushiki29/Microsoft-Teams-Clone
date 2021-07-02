from django.urls import path

from . import views

urlpatterns = [
    path('user_login', views.user_login, name='user_login'),
    path('signup', views.signup, name='signup'),
    path('get_username',views.get_username, name='get_username'),
    # path('verify_email',views.verify_email, name='verify_email'),
    # path('check_verified_user',views.check_verified_user, name='check_verified_user'),
    #     path('admin_login',views.admin_login,name='admin_login'),
    path('logout', views.logout, name='logout'),
]
