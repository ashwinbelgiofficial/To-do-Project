from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.authtoken.views import obtain_auth_token


def home(request):
    return JsonResponse({
        "message": "Todo API is running!",
        "api": "/api/",
        "tasks": "/api/tasks/"
    })


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),
    path('api-token-auth/', obtain_auth_token),
]