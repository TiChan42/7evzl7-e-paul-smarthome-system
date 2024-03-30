from django.test import TestCase, RequestFactory
from django.urls import reverse
from ..model.account import Account
from ..model.microcontroller import Microcontroller
from ..model.port import Port
from ..views.devices import DeviceView, AddPort, UpdateCurrentState, ExecuteCommand
from ..serializer.microcontrollerSerializer import MicrocontrollerSerializer
from ..model.user import User
from ..model.portTemplate import PortTemplate
from ..model.knownControllerType import KnownControllerType

class TestDeviceView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_device_info(self):
        # Create a test account
        account = Account.objects.create(email="test@example.com", password="123")

        # Create a request to test the POST method
        request_data = {"accountId": account.id}
        request = self.factory.post('/device-info/', data=request_data)
        response = DeviceView.as_view()(request)

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

class TestAddPort(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_microcontrollers(self):
        # Create some test microcontrollers
        account = Account.objects.create(email="test@example.com", password="123")

        # Create a test microcontroller associated with the test account
        microcontroller1 = Microcontroller.objects.create(name="Test Microcontroller", account=account, type="type")
        microcontroller2 = Microcontroller.objects.create(name="Microcontroller 2", account=account, type="type")

        # Create a request to test the GET method
        request = self.factory.get('/microcontrollers/')
        response = AddPort.as_view()(request)

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the data returned contains all microcontrollers
        expected_data = MicrocontrollerSerializer([microcontroller1, microcontroller2], many=True).data
        self.assertEqual(response.data, expected_data)

"""
class TestAddPortPostMethod(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.microcontroller = Microcontroller.objects.create(key="test_key", name="test_micro", type="type", account=self.account)
        self.knownControllerType = KnownControllerType.objects.create(account=self.account, type="type")
        self.portTemplate = PortTemplate.objects.create(knownControllerType=self.knownControllerType)
        self.port = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller, portTemplate=self.portTemplate)
        self.factory = RequestFactory()

    def test_post_with_valid_data(self):
        
        port = self.port.save()
       
        request_data = {"microcontrollerId": self.microcontroller.id, "type": self.microcontroller.type}
        request = self.factory.post('/addPort/', data=request_data, content_type='application/json')
        response = AddPort.as_view()(request)

        self.assertEqual(response.status_code, 201)

        created_port = Port.objects.last()
        self.assertEqual(created_port.type, "test")

    def test_post_with_missing_microcontroller_id(self):
        request_data = {"type": "test"}
        request = self.factory.post('/addPort/', data=request_data, content_type='application/json')
        response = AddPort.as_view()(request)

        self.assertEqual(response.status_code, 400)

    def test_post_with_invalid_microcontroller_id(self):
        request_data = {"microcontrollerId": 999, "type": "test"}
        request = self.factory.post('/addPort/', data=request_data, content_type='application/json')
        response = AddPort.as_view()(request)

        self.assertEqual(response.status_code, 404)

"""

class UpdateCurrentStateTest(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.microcontroller = Microcontroller.objects.create(key="test_key", name="test_micro", type="type", account=self.account)
        self.knownControllerType = KnownControllerType.objects.create(account=self.account, type="type")
        self.portTemplate = PortTemplate.objects.create(knownControllerType=self.knownControllerType)
        self.port = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller, portTemplate=self.portTemplate)
        self.factory = RequestFactory()

    def test_put_with_valid_data(self):
        data = {
            "key": "test_key",
            "microcontrollerId": self.microcontroller.id,
            "state": "ON"
        }

        
        request = self.factory.put('/updateState/', data=data, content_type='application/json')
        response = UpdateCurrentState.as_view()(request)
        self.assertEqual(response.status_code, 204)

        updated_port = Port.objects.get(id=self.port.id)
        self.assertEqual(updated_port.currentStatus, data["state"])

    def test_put_with_missing_data(self):
        data = {
            "microcontrollerId": self.microcontroller.id,
            "state": "ON"
        }

        request = self.factory.put('/updateState/', data=data, content_type='application/json')
        response = UpdateCurrentState.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_put_with_invalid_key(self):
        data = {
            "invalid_key": "test_key",
            "microcontrollerId": self.microcontroller.id,
            "state": "new_state"
        }

        request = self.factory.put('/updateState/', data=data, content_type='application/json')
        response = UpdateCurrentState.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_put_microcontroller_not_found(self):
        data = {"key": "test_key", 
                "microcontrollerId": int(self.microcontroller.id - 1), 
                "state": "ON"}
        request = self.factory.put('/updateState/', data=data, content_type='application/json')
        response = UpdateCurrentState.as_view()(request)
        self.assertEqual(response.status_code, 400)

    def test_update_current_state_correct_password(self):
        data = {
            "key": "test_key",
            "microcontrollerId": self.microcontroller.id,
            "state": "OFF"
        }

        request = self.factory.put('/updateState/', data=data, content_type='application/json')
        response = UpdateCurrentState.as_view()(request)
        self.assertEqual(response.status_code, 204)

    def test_update_current_state_incorrect_password(self):
        data = {
            "key": "invalid_key",
            "microcontrollerId": self.microcontroller.id,
            "state": "OFF"
        }

        request = self.factory.put('/updateState/', data=data, content_type='application/json')
        response = UpdateCurrentState.as_view()(request)
        self.assertEqual(response.status_code, 400)


class TestExecuteCommand(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.microcontroller = Microcontroller.objects.create(key="test_key", name="test_micro", type="type", account=self.account)
        self.knownControllerType = KnownControllerType.objects.create(account=self.account, type="type")
        self.portTemplate = PortTemplate.objects.create(knownControllerType=self.knownControllerType)
        self.port = Port.objects.create(name="test_micro", type="type" ,microcontroller=self.microcontroller, portTemplate=self.portTemplate)
        self.factory = RequestFactory()

    def test_execute_command_invalid_data(self):
        data = {
            "command": {
                "target": self.microcontroller.id,
                "command": "changeLampBrightness",
                "brightness": "0",
                "rgb": "0"
                }
        }

        request = self.factory.post('/executeCommand/', data=data, content_type='application/json')
        response = ExecuteCommand.as_view()(request)

        self.assertEqual(response.status_code, 420)

    def test_execute_command_missing_data(self):
        request_data = {
            
        }
        request = self.factory.post('/executeCommand/', data=request_data, content_type='application/json')
        response = ExecuteCommand.as_view()(request)

        # Check if the response status code is 400 (Bad Request)
        self.assertEqual(response.status_code, 400)
    
    

    



