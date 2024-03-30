from ..model.scene import Scene
from ..model.group import Group
from ..model.user import User
from ..model.state import State
from ..model.port import Port
from ..model.microcontroller import Microcontroller
from ..model.account import Account
from ..model.portTemplate import PortTemplate
from ..model.knownControllerType import KnownControllerType
from ..model.scene import Scene
from ..model.state import State
from ..model.groupPort import GroupPort
from django.test import TestCase, RequestFactory
from ..views.settings import RightsSettings, SingleUserSettingsView, ChangeRole, ChangeMail


class TestRightsSettings(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.superuser)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup", groupType = "Assignment")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

        self.account2 = Account.objects.create(email='test22@example.com', password="12345")
        self.user2 = User.objects.create(username='test_user2', account=self.account2, role=User.Role.admin)
        self.group2 = Group.objects.create(user=self.user2, name="testgroup", groupType = "Assignment")
        self.microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=self.account2)
        self.knownControllerType2 = KnownControllerType.objects.create(account=self.account2, type="type")
        self.portTemplate2 = PortTemplate.objects.create(knownControllerType=self.knownControllerType2)
        self.port2 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller2, portTemplate=self.portTemplate2, currentStatus={})
        self.scene2 = Scene.objects.create(group=self.group2, name="scene2")
        self.state2 = State.objects.create(scene=self.scene2, port=self.port2, state={"state":"nostate"})
        self.groupPort2 = GroupPort.objects.create(group=self.group2, port=self.port2, name="groupport2")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_rights_valid_data(self):
        data = {
            "executingUserId": self.user1.id,
            "value": 0,
            "userRightKey": "mayAssignController",
            "userId": self.user2.id
        }

        request = self.factory.put('/addScene/', data=data, content_type='application/json')
        response = RightsSettings.as_view()(request)
        self.assertEqual(response.status_code, 202)

    def test_rights_invalid_key(self):
        data = {
            "invalid_key": self.user1.id,
            "value": 0,
            "userRightKey": "mayAssignController",
            "userId": self.user2.id
        }

        request = self.factory.put('/addScene/', data=data, content_type='application/json')
        response = RightsSettings.as_view()(request)
        self.assertEqual(response.status_code, 400)

class TestSingleUserSettingsView(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.superuser)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup", groupType = "Assignment")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

        self.account2 = Account.objects.create(email='test22@example.com', password="12345")
        self.user2 = User.objects.create(username='test_user2', account=self.account2, role=User.Role.admin)
        self.group2 = Group.objects.create(user=self.user2, name="testgroup", groupType = "Assignment")
        self.microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=self.account2)
        self.knownControllerType2 = KnownControllerType.objects.create(account=self.account2, type="type")
        self.portTemplate2 = PortTemplate.objects.create(knownControllerType=self.knownControllerType2)
        self.port2 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller2, portTemplate=self.portTemplate2, currentStatus={})
        self.scene2 = Scene.objects.create(group=self.group2, name="scene2")
        self.state2 = State.objects.create(scene=self.scene2, port=self.port2, state={"state":"nostate"})
        self.groupPort2 = GroupPort.objects.create(group=self.group2, port=self.port2, name="groupport2")
        self.factory = RequestFactory(raise_request_exception=False)


    def test_rights_valid_data(self):
        data = {
            "userId": self.user2.id,
            "executingUserId": self.user1.id,
            "gender": "weiblich",
            "accountId": self.account2.id,
            "username" : "newUserName"
        }

        request = self.factory.put('/userSettings/', data=data, content_type='application/json')
        response = SingleUserSettingsView.as_view()(request)
        self.assertEqual(response.status_code, 204)


class TestChangeRole(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.superuser)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup", groupType = "Assignment")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

        self.account2 = Account.objects.create(email='test22@example.com', password="12345")
        self.user2 = User.objects.create(username='test_user2', account=self.account2, role=User.Role.admin)
        self.group2 = Group.objects.create(user=self.user2, name="testgroup", groupType = "Assignment")
        self.microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=self.account2)
        self.knownControllerType2 = KnownControllerType.objects.create(account=self.account2, type="type")
        self.portTemplate2 = PortTemplate.objects.create(knownControllerType=self.knownControllerType2)
        self.port2 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller2, portTemplate=self.portTemplate2, currentStatus={})
        self.scene2 = Scene.objects.create(group=self.group2, name="scene2")
        self.state2 = State.objects.create(scene=self.scene2, port=self.port2, state={"state":"nostate"})
        self.groupPort2 = GroupPort.objects.create(group=self.group2, port=self.port2, name="groupport2")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_change_rights_valid_data(self):
        data = {
            "userId": self.user2.id,
            "executingUserId": self.user1.id,
            "role": "user" 
        }

        request = self.factory.put('/changeRole/', data=data, content_type='application/json')
        response = ChangeRole.as_view()(request)
        self.assertEqual(response.status_code, 204)

class TestChangeMail(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.superuser)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup", groupType = "Assignment")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_change_mail_valid_data(self):
        data = {
            "userId": self.user1.id,
            "accountId": self.account1.id,
            "email": "newmail@test.com" 
        }

        request = self.factory.put('/changeMail/', data=data, content_type='application/json')
        response = ChangeMail.as_view()(request)
        self.assertEqual(response.status_code, 204)