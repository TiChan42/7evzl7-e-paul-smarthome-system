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
from ..views.scene import Scene, SceneAddPort, SceneRemovePort, CreateScene, DeleteScene, ChangeSceneName



class TestCreateScene(TestCase):
    def setUp(self):
        self.factory = RequestFactory(raise_request_exception=False)
    
    def test_create_valid_data(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1, currentStatus={})
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")
        factory = RequestFactory(raise_request_exception=False)


        data = {
            "executingUserId": 1,
            "groupId": 1,
            "name": "Admin Scene",
            "ignoredPorts": []
        }

      
        request = factory.post('/addScene/', data=data, content_type='application/json')
        response = CreateScene.as_view()(request)
        self.assertEqual(response.status_code, 201)


    def test_create_invalid_key(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1, currentStatus={})
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")
        factory = RequestFactory(raise_request_exception=False)


        data = {
            "invalid_key": 1,
            "groupId": 1,
            "name": "Admin Scene",
            "ignoredPorts": []
        }

      
        request = factory.post('/addScene/', data=data, content_type='application/json')
        response = CreateScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_create_no_user(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1, currentStatus={})
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")
        factory = RequestFactory(raise_request_exception=False)


        data = {
            "executingUserId": 2,
            "groupId": 1,
            "name": "Admin Scene",
            "ignoredPorts": []
        }

      
        request = factory.post('/addScene/', data=data, content_type='application/json')
        response = CreateScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_create_no_group(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1, currentStatus={})
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")
        factory = RequestFactory(raise_request_exception=False)


        data = {
            "executingUserId": user1.id,
            "groupId": 55,
            "name": "Admin Scene",
            "ignoredPorts": []
        }

      
        request = factory.post('/addScene/', data=data, content_type='application/json')
        response = CreateScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_create_with_ignoredport(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1, currentStatus={})
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")
        factory = RequestFactory(raise_request_exception=False)


        data = {
            "executingUserId": user1.id,
            "groupId": group1.id,
            "name": "Admin Scene",
            "ignoredPorts": [1]
        }

      
        request = factory.post('/addScene/', data=data, content_type='application/json')
        response = CreateScene.as_view()(request)
        self.assertEqual(response.status_code, 201)

    def test_create_with_existingName(self):
        account1 = Account.objects.create(email='test11@example.com', password="123")
        user1 = User.objects.create(username='test_user1', account=account1, role=User.Role.admin)
        group1 = Group.objects.create(user=user1, name="testgroup")
        microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=account1)
        knownControllerType1 = KnownControllerType.objects.create(account=account1, type="type")
        portTemplate1 = PortTemplate.objects.create(knownControllerType=knownControllerType1)
        port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=microcontroller1, portTemplate=portTemplate1, currentStatus={})
        scene1 = Scene.objects.create(group=group1, name="scene1")
        state1 = State.objects.create(scene=scene1, port=port1, state={"state":"nostate"})
        groupPort1 = GroupPort.objects.create(group=group1, port=port1, name="groupport1")
        factory = RequestFactory(raise_request_exception=False)


        data = {
            "executingUserId": user1.id,
            "groupId": group1.id,
            "name": scene1.name,
            "ignoredPorts": []
        }

      
        request = factory.post('/addScene/', data=data, content_type='application/json')
        response = CreateScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

class TestDeleteScene(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.admin)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_delete_valid_data(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": self.scene1.id
        }
        request = self.factory.post('/deleteScene/', data=data, content_type='application/json')
        response = DeleteScene.as_view()(request)
        self.assertEqual(response.status_code, 204)

    def test_delete_invalid_key(self):
        data = {
            "invalid_key": self.user1.id,
            "sceneId": self.scene1.id
        }
        request = self.factory.post('/deleteScene/', data=data, content_type='application/json')
        response = DeleteScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_delete_no_user(self):
        data = {
            "executingUserId": 99,
            "sceneId": self.scene1.id
        }
        request = self.factory.post('/deleteScene/', data=data, content_type='application/json')
        response = DeleteScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_delete_no_scene(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": 99
        }
        request = self.factory.post('/deleteScene/', data=data, content_type='application/json')
        response = DeleteScene.as_view()(request)
        self.assertEqual(response.status_code, 400)

class TestChangeSceneName(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.admin)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_change_valid_data(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": self.scene1.id,
            "name": "NewName"
        }
        request = self.factory.put('/changeSceneName/', data=data, content_type='application/json')
        response = ChangeSceneName.as_view()(request)
        self.assertEqual(response.status_code, 204)

    def test_change_invalid_key(self):
        data = {
            "invalid_key": self.user1.id,
            "sceneId": self.scene1.id,
            "name": "NewName"
        }
        request = self.factory.put('/changeSceneName/', data=data, content_type='application/json')
        response = ChangeSceneName.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_change_no_user(self):
        data = {
            "executingUserId": 99,
            "sceneId": self.scene1.id,
            "name": "NewName"
        }
        request = self.factory.put('/changeSceneName/', data=data, content_type='application/json')
        response = ChangeSceneName.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_change_no_scene(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": 99,
            "name": "NewName"
        }
        request = self.factory.put('/changeSceneName/', data=data, content_type='application/json')
        response = ChangeSceneName.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_change_name_exists(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": self.scene1.id,
            "name": self.scene1.name
        }
        request = self.factory.put('/changeSceneName/', data=data, content_type='application/json')
        response = ChangeSceneName.as_view()(request)
        self.assertEqual(response.status_code, 400)

class TestSceneAddPort(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.admin)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup", groupType = "Assignment")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_add_valid_data(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": self.scene1.id,
            "portId": self.port1.id
        }
        request = self.factory.post('/addPortToScene/', data=data, content_type='application/json')
        response = SceneAddPort.as_view()(request)
        self.assertEqual(response.status_code, 201)

    def test_add_invalid_key(self):
        data = {
            "invalid_key": self.user1.id,
            "sceneId": self.scene1.id,
            "portId": self.port1.id
        }
        request = self.factory.post('/addPortToScene/', data=data, content_type='application/json')
        response = SceneAddPort.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_add_no_user(self):
        data = {
            "executingUserId": 99,
            "sceneId": self.scene1.id,
            "portId": self.port1.id
        }
        request = self.factory.post('/addPortToScene/', data=data, content_type='application/json')
        response = SceneAddPort.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_add_no_scene(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": 99,
            "portId": self.port1.id
        }
        request = self.factory.post('/addPortToScene/', data=data, content_type='application/json')
        response = SceneAddPort.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_add_no_port(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": self.scene1.id,
            "portId": 99
        }
        request = self.factory.post('/addPortToScene/', data=data, content_type='application/json')
        response = SceneAddPort.as_view()(request)
        self.assertEqual(response.status_code, 400)

class TestSceneRemovePort(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test11@example.com', password="123")
        self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.admin)
        self.group1 = Group.objects.create(user=self.user1, name="testgroup", groupType = "Assignment")
        self.microcontroller1 = Microcontroller.objects.create(key="test_key11", name="test_micro", type="type", account=self.account1)
        self.knownControllerType1 = KnownControllerType.objects.create(account=self.account1, type="type")
        self.portTemplate1 = PortTemplate.objects.create(knownControllerType=self.knownControllerType1)
        self.port1 = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller1, portTemplate=self.portTemplate1, currentStatus={})
        self.scene1 = Scene.objects.create(group=self.group1, name="scene1")
        self.state1 = State.objects.create(scene=self.scene1, port=self.port1, state={"state":"nostate"})
        self.groupPort1 = GroupPort.objects.create(group=self.group1, port=self.port1, name="groupport1")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_remove_valid_data(self):
        data = {
            "executingUserId": self.user1.id,
            "sceneId": self.scene1.id,
            "portId": self.port1.id
        }
        request = self.factory.post('/removePortFromScene/', data=data, content_type='application/json')
        response = SceneRemovePort.as_view()(request)
        self.assertEqual(response.status_code, 204)

    def test_remove_invalid_key(self):
        data = {
            "invalid_key": self.user1.id,
            "sceneId": self.scene1.id,
            "portId": self.port1.id
        }
        request = self.factory.post('/removePortFromScene/', data=data, content_type='application/json')
        response = SceneRemovePort.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_remove_no_user(self):
        data = {
            "executingUserId": 99,
            "sceneId": self.scene1.id,
            "portId": self.port1.id
        }
        request = self.factory.post('/removePortFromScene/', data=data, content_type='application/json')
        response = SceneRemovePort.as_view()(request)
        self.assertEqual(response.status_code, 400)