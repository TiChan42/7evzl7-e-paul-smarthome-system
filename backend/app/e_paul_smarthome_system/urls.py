from django import urls

from .views.userView import UserView
from django.urls import path

urlpatterns = [
    path("user", UserView.as_view(), name = "user"),
]
