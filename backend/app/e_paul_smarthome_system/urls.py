from django import urls
from .views.settings import RightsSettings, SingleUserSettingsView, ChangePin, ChangeRole, ChangeMail
from .views.userView import UserView, SingleUserView, DeleteUserView
from .views.account import AccountView, DeleteAccount
from .views.about_us import AboutUsView
from .views.login import Login, LoginUser
from .views.signUp import SignUp, CreateUser, MicrocontrollerSignUp, EmailVerification
from .views.logout import Logout
from .views.home import HomeView
from .views.devices import DeviceView, AddPort, UpdateCurrentState
from .views.validate import ValidatePin, ValidateEmail, CheckPinRequired
from .views.getData import GetUsers, GetVerified, GetGroups, GetPorts, GetUserRights, GetCommands, GetScenes, GetEmails
from .views.group import AddPortToGroup, RemovePortFromGroup, AddGroup, DeleteGroup, ChangeGroupName
from .views.scene import CreateScene, DeleteScene, ChangeSceneName, SceneAddPort, UpdateState, SceneRemovePort
from django.urls import path


urlpatterns = [
    path("user",                                        UserView.as_view(),                 name = "user"),
    path("user/addGroup",                               AddGroup.as_view(),                 name = "addGroup"),
    path("user/deleteGroup",                            DeleteGroup.as_view(),              name = "deleteGroup"),
    path("user/changeRole",                             ChangeRole.as_view(),               name = "changeRole"), 
    path("user/deleteUser",                             DeleteUserView.as_view(),           name = "deleteUser"),
    path("user/<userId>",                               SingleUserView.as_view(),           name = "singleUser"),
    path("account",                                     AccountView.as_view(),              name = "group"),
    path("deleteAccount",                               DeleteAccount.as_view(),            name = "deleteAccount"),
    path("aboutUs",                                     AboutUsView.as_view(),              name="aboutUs"),
    path("signUp",                                      SignUp.as_view(),                   name="signUp"),
    path("signUp/email",                                EmailVerification.as_view(),        name="signUpEmail"),
    path("signUp/user",                                 CreateUser.as_view(),               name="signUpuser"),
    path("signUp/microcontroller",                      MicrocontrollerSignUp.as_view(),    name="signUpMicrocontroller"),
    path("login",                                       Login.as_view(),                    name="login"),
    path("login/user",                                  LoginUser.as_view(),                name = "loginUser"),
    path("logout",                                      Logout.as_view(),                   name = "logout"),
    path("home/<userId>",                               HomeView.as_view(),                 name="home"),
    path("devices",                                     DeviceView.as_view(),               name = "devices"),
    path("devices/addPort",                             AddPort.as_view(),                  name = "addPort"),
    path("validatePin",                                 ValidatePin.as_view(),              name = "validatePin"),
    path("validateEmail",                               ValidateEmail.as_view(),            name = "validateEmail"),
    path("pinRequired/<userid>",                        CheckPinRequired.as_view(),         name = "pinRequired"),
    path("settings/rights",                             RightsSettings.as_view(),           name = "rightsSettings"),
    path("settings/pin",                                ChangePin.as_view(),                name = "validatePin"),
    path("settings/changeMail",                         ChangeMail.as_view(),               name = "changeMail"),
    path("settings/changeUserInformation",              SingleUserSettingsView.as_view(),   name = "userSettings"),
    path("getEmails",                                   GetEmails.as_view(),                name = "getEmails"),
    path("getUsers/<accountId>",                        GetUsers.as_view(),                 name = "getUser"),
    path("getVerified/<accountId>",                     GetVerified.as_view(),              name = "getVerified"),
    path("getGroup/<type>/<userId>",                    GetGroups.as_view(),                name = "getGroup"),
    path("getPorts/<accountId>",                        GetPorts.as_view(),                 name = "getPorts"),
    path("getCommands/<portId>",                        GetCommands.as_view(),              name = "getCommands"),
    path("getScenes/<groupId>",                         GetScenes.as_view(),                name = "getScenes"),
    path("getUserRights/<userId>/<executingUserId>",    GetUserRights.as_view(),            name = "getUserRights"),
    path("port/setCurrentState",                        UpdateCurrentState.as_view(),       name = "updateCurrentState"),
    path("group/addPort",                               AddPortToGroup.as_view(),           name = "addPortToGroup"),
    path("group/removePort",                            RemovePortFromGroup.as_view(),      name = "deletePortFromGroup"),
    path("group/changeName",                            ChangeGroupName.as_view(),          name = "changeGroupName"),
    path("group/scene/addScene",                        CreateScene.as_view(),              name = "addScene"),
    path("group/scene/deleteScene",                     DeleteScene.as_view(),              name = "deleteScene"),
    path("group/scene/changeName",                      ChangeSceneName.as_view(),          name = "changeSceneName"),
    path("group/scene/addPort",                         SceneAddPort.as_view(),             name = "addPortToScene"),
    path("group/scene/removePort",                      SceneRemovePort.as_view(),          name = "removePortFromScene"),
    path("group/scene/UpdateState",                     UpdateState.as_view(),              name = "updateState"),
    ]
