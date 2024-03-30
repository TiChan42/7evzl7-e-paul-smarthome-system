from django.test import TestCase, RequestFactory
from ..views.group import AddGroup, DeleteGroup, AddPortToGroup, RemovePortFromGroup, ChangeGroupName
from ..model.account import Account
from ..model.user import User
from ..model.group import Group
from ..model.port import Port
from ..model.microcontroller import Microcontroller
from ..model.portTemplate import PortTemplate
from ..model.knownControllerType import KnownControllerType
from ..model.scene import Scene
from ..model.state import State
from ..model.groupPort import GroupPort


class TestAddGroup(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.superuser)
        self.factory = RequestFactory(raise_request_exception=False)

    def test_add_group_with_valid_data(self):
        request_data = {
            "userId": self.user.id,
            "name": "Test Group",
            "clientIds": [1,2]
        }
        request = self.factory.post('/addGroup/', data=request_data)
        response = AddGroup.as_view()(request)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Group.objects.filter(name="Test Group", user=self.user, groupType="Standard").exists())

    def test_add_group_with_invalid_user(self):
        request_data = {
            "userId": 999,  
            "name": "",
            "clientIds": [1,2]
        }
        request = self.factory.post('/addGroup/', data=request_data)
        response = AddGroup.as_view()(request)

        self.assertEqual(response.status_code, 400)


class TestDeleteGroup(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.superuser)
        self.group = Group.objects.create(user=self.user, name="testgroup")
        self.group2 = Group.objects.create(user=self.user, name="testgroup2", groupType="Assignment")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_delete_group_valid_data(self):
        request_data = {
            "userId": self.user.id,
            "groupId": self.group.id
        }
        request = self.factory.post('/deleteGroup/', data=request_data)
        response = DeleteGroup.as_view()(request)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Group.objects.filter(id=self.group.id).exists())

    def test_delete_group_invalid_user(self):
        request_data = {
            "userId": 999,  
            "groupId": 888  
        }
        request = self.factory.post('/deleteGroup/', data=request_data)
        response = DeleteGroup.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_delete_group_invalid_key(self):
        request_data = {
            "invalid_key": self.user.id,
            "groupId": self.group.id
        }
        request = self.factory.post('/deleteGroup/', data=request_data)
        response = DeleteGroup.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_delete_group_type_not_standard(self):
        request_data = {
            "userId": self.user.id,
            "groupId": self.group2.id
        }
        request = self.factory.post('/deleteGroup/', data=request_data)
        response = DeleteGroup.as_view()(request)
        self.assertEqual(response.status_code, 400)
        
class TestAddPortToGroup(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.account2 = Account.objects.create(email='test2@example.com', password="12345")
        self.user1 = User.objects.create(username='test_user1', account=self.account, role=User.Role.admin)
        self.user2 = User.objects.create(username='test_user2', account=self.account2, role=User.Role.superuser)
        self.group = Group.objects.create(user=self.user1, name="testgroup")
        #self.group2 = Group.objects.create(user=self.user, name="testgroup2", groupType="Assignment")
        self.microcontroller = Microcontroller.objects.create(key="test_key", name="test_micro", type="type", account=self.account)
        self.knownControllerType = KnownControllerType.objects.create(account=self.account, type="type")
        self.portTemplate = PortTemplate.objects.create(knownControllerType=self.knownControllerType)
        self.port = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller, portTemplate=self.portTemplate)
        self.factory = RequestFactory(raise_request_exception=False)

    def test_port_to_group_invalid_data(self):
        data = {
            "userId": self.user1.id,
            "groupId": self.group.id,
            "portId": self.port.id,
            "executingUserId": self.user2.id
        }

        request = self.factory.post('/addPortToGroup/', data=data)
        response = AddPortToGroup.as_view()(request)
        self.assertEqual(response.status_code, 400)


    def test_port_to_group_valid_data(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1)
        
        account2 = Account.objects.create(email='test22@example.com', password="12345")
        user2 = User.objects.create(username='test_user2', account=account2, role=User.Role.superuser)
        group2 = Group.objects.create(user=user2, name="testgroup2", groupType="Assignment")
        microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=account2)
        knownControllerType2 = KnownControllerType.objects.create(account=account2, type="type")
        portTemplate2 = PortTemplate.objects.create(knownControllerType=knownControllerType2)
        port2 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller2, portTemplate=portTemplate2)
        factory = RequestFactory(raise_request_exception=False)
        data = {
            "userId": user1.id,
            "groupId": group1.id,
            "portId": port2.id,
            "executingUserId": user2.id
        }

        request = factory.post('/addPortToGroup/', data=data)
        response = AddPortToGroup.as_view()(request)
        self.assertEqual(response.status_code, 201)

class TestRemovePortFromGroup(TestCase):
    def test_remove_port_from_group_valid_data(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1)
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")

        account2 = Account.objects.create(email='test22@example.com', password="12345")
        user2 = User.objects.create(username='test_user2', account=account2, role=User.Role.superuser)
        group2 = Group.objects.create(user=user2, name="testgroup2", groupType="Assignment")
        microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=account2)
        knownControllerType2 = KnownControllerType.objects.create(account=account2, type="type")
        portTemplate2 = PortTemplate.objects.create(knownControllerType=knownControllerType2)
        port2 = Port.objects.create(name="test_micro", type="type", microcontroller=microcontroller2, portTemplate=portTemplate2)
        scene2 = Scene.objects.create(group=group2, name="scene2")
        state2 = State.objects.create(scene=scene2, port=port2, state={"state":"nostate"})
        groupPort2 = GroupPort.objects.create(group=group2, port=port2, name="groupport2")
        factory = RequestFactory(raise_request_exception=False)

        data = {
            "userId": user1.id,
            "groupId": group1.id,
            "portId": port1.id,
            "executingUserId": user2.id
        }

        request = factory.post('/deletePortFromGroup/', data=data)
        response = RemovePortFromGroup.as_view()(request)
        self.assertEqual(response.status_code, 204)

class TestChangeGroupName(TestCase):
    def test_change_group_name_invalid_data_assigment(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup", groupType="Assignment")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1)
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")

        account2 = Account.objects.create(email='test22@example.com', password="12345")
        user2 = User.objects.create(username='test_user2', account=account2, role=User.Role.superuser)
        group2 = Group.objects.create(user=user2, name="testgroup2", groupType="Assignment")
        microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=account2)
        knownControllerType2 = KnownControllerType.objects.create(account=account2, type="type")
        portTemplate2 = PortTemplate.objects.create(knownControllerType=knownControllerType2)
        port2 = Port.objects.create(name="test_micro", type="type", microcontroller=microcontroller2, portTemplate=portTemplate2)
        scene2 = Scene.objects.create(group=group2, name="scene2")
        state2 = State.objects.create(scene=scene2, port=port2, state={"state":"nostate"})
        groupPort2 = GroupPort.objects.create(group=group2, port=port2, name="groupport2")
        factory = RequestFactory(raise_request_exception=False)

        data = {
            "executingUserId": user1.id,
            "groupId": group1.id,
            "name": "NewGroup"
        }
        request = factory.put('/changeGroupName/', data=data, content_type='application/json')
        response = ChangeGroupName.as_view()(request)
        self.assertEqual(response.status_code, 400)



    def test_change_group_name_valid_data_standard(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup", groupType="Standard")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1)
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")

        account2 = Account.objects.create(email='test22@example.com', password="12345")
        user2 = User.objects.create(username='test_user2', account=account2, role=User.Role.superuser)
        group2 = Group.objects.create(user=user2, name="testgroup2", groupType="Standard")
        microcontroller2 = Microcontroller.objects.create(key="test_key22", name="test_micro", type="type", account=account2)
        knownControllerType2 = KnownControllerType.objects.create(account=account2, type="type")
        portTemplate2 = PortTemplate.objects.create(knownControllerType=knownControllerType2)
        port2 = Port.objects.create(name="test_micro", type="type", microcontroller=microcontroller2, portTemplate=portTemplate2)
        scene2 = Scene.objects.create(group=group2, name="scene2")
        state2 = State.objects.create(scene=scene2, port=port2, state={"state":"nostate"})
        groupPort2 = GroupPort.objects.create(group=group2, port=port2, name="groupport2")
        factory = RequestFactory(raise_request_exception=False)

        data = {
            "executingUserId": user1.id,
            "groupId": group1.id,
            "name": "NewGroup"
        }
        request = factory.put('/changeGroupName/', data=data, content_type='application/json')
        response = ChangeGroupName.as_view()(request)

        self.assertEqual(response.status_code, 204)
        group1.refresh_from_db()
        self.assertEqual(group1.name, "NewGroup")


        

    