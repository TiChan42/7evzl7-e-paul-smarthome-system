from django import urls
from .views.settings import RightsSettings, SingleUserSettingsView, ChangePin
from .views.userView import UserView, SingleUserView
from .views.accountView import AccountView
from .views.about_us import AboutUsView
from .views.login import Login, LoginUser
from .views.signUp import SignUp, CreateUser, MicrocontrollerSignUp, EmailVerification
from .views.logout import Logout
from .views.home import HomeView
from .views.devices import DeviceView, AddPort
from .views.validate import ValidatePin, ValidateEmail
from .views.getData import GetUser, GetVerified
from .views.group import AddPortToGroup
from django.urls import path


urlpatterns = [
    path("user", UserView.as_view(), name = "user"),
    path("user/<userId>", SingleUserView.as_view(), name = "singleUser"),
    path("account", AccountView.as_view(), name = "group"),
    path("aboutUs", AboutUsView.as_view(), name="aboutUs"),
    path("signUp", SignUp.as_view(), name="signUp"),
    path("signUp/email", EmailVerification.as_view(), name="signUpEmail"),
    path("signUp/user", CreateUser.as_view(), name="signUpuser"),
    path("signUp/microcontroller", MicrocontrollerSignUp.as_view(), name="signUpMicrocontroller"),
    path("login", Login.as_view(), name="login"),
    path("login/user", LoginUser.as_view(), name = "loginUser"),
    path("logout", Logout.as_view(), name = "logout"),
    path("home/<userId>", HomeView.as_view(), name="home"),
    path("devices", DeviceView.as_view(), name = "devices"),
    path("devices/addPort", AddPort.as_view(), name = "addPort"),
    path("validatePin", ValidatePin.as_view(), name = "validatePin"),
    path("validateEmail", ValidateEmail.as_view(), name = "validateEmail"),
    path("settings/rights", RightsSettings.as_view(), name = "rightsSettings"),
    path("settings/pin", ChangePin.as_view(), name = "validatePin"),
    path("settings/<userId>", SingleUserSettingsView.as_view(), name = "userSettings"),
    path("getUser/<accountId>", GetUser.as_view(), name = "getUser"),
    path("getVerified/<accountId>", GetVerified.as_view(), name = "getVerified"),
    path("group/addPort/<userId>", AddPortToGroup.as_view(), name = "addPortToGroup"),
    ]
