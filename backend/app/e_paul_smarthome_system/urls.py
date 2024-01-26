from django import urls

from .views.userView import UserView, SingleUserView
from .views.accountView import AccountView
from .views.about_us import AboutUsView
from .views.login import Login
from .views.signUp import SignUp
from .views.logout import Logout
from django.urls import path


urlpatterns = [
    path("user", UserView.as_view(), name = "user"),
    path("user/<userid>", SingleUserView.as_view(), name = "singleUser"),
    path("account", AccountView.as_view(), name = "group"),
    path("about_us", AboutUsView.as_view(), name="aboutUs"),
    path("signUp", SignUp.as_view(), name="SignUp"),
    path("login", Login.as_view(), name="Login"),
    path("logout", Logout.as_view(), name = "Logout"),
]
