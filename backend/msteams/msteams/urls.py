from django.urls import include, path

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('auth/',include('authentication.urls')),
    path('teams/',include('teams.urls')),
    path('communication/',include('communication.urls'))
]
