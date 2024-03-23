from ..model.account import Account
from ..model.microcontroller import Microcontroller
from ..model.port import Port
from ..model.user import User
from ..model.group import Group
from ..model.groupPort import GroupPort
from ..model.commandOption import CommandOption
from ..model.command import Command

from ..serializer.accountSerializer import AccountMicrocontrollerSerializer
from ..serializer.microcontrollerSerializer import MicrocontrollerSerializer
from ..serializer.commandOptionSerializer import CommandOptionSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

from ..mqttFunctions.python_client_pub import PythonClientPub

class DeviceView(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        id = request.data['accountId']
        queryset = Account.objects.get(pk = id)
        serializer = AccountMicrocontrollerSerializer(queryset)
        return Response(serializer.data, status = 200)

"""
teststring
{
    "accountId" : 1
}
"""


class AddPort(APIView):
    queryset = Microcontroller.objects.all()

    def get(self, request):
        queryset = Microcontroller.objects.all()
        serializer = MicrocontrollerSerializer(queryset, many = True)
        return Response(serializer.data, status = 200)
        
    
    def post(self, request):
        data = request.data
        try:
            id = data["microcontrollerId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            microcontroller = Microcontroller.objects.get(pk = id)
        except Microcontroller.DoesNotExist:
            return Response(status = 404)
        
        if data["type"]:
            type = data["type"]
            port = Port(type = type, microcontroller = microcontroller, name = microcontroller.name)
            port.save()
            superuser = User.objects.get(account__microcontroller__port__id = port.id, role = "Superuser")
            assignmentGroup = Group.objects.get(user = superuser, groupType = "Assignment")
            groupPort = GroupPort(group = assignmentGroup, port = port)
            groupPort.save()
            return Response(status = 201)
        else: 
            port = Port(type = "controller", microcontroller = microcontroller, name = microcontroller.name)
            port.save()
            superuser = User.objects.get(account__microcontroller__port__id = port.id, role = "Superuser")
            assignmentGroup = Group.objects.get(user = superuser, groupType = "Assignment")
            groupPort = GroupPort(group = assignmentGroup, port = port)
            groupPort.save()
            return Response({"message":"Der Port wurde automatisch auf controller gesetzt"} ,status = 201)
"""
teststring
{
    "microcontrollerId" : 1,
    "type" : "test"
}

"""

class UpdateCurrentState(APIView):
    queryset = Port.objects.all()

    def put(self, request):
        data = request.data
        try:
            password = data["key"]
            id = data["microcontrollerId"]
            currentStatus = data["state"]
        except KeyError:
            return Response(status = 400)
        
        try:
            microcontroller = Microcontroller.objects.get(pk = id)
        except Microcontroller.DoesNotExist:
            return Response(status = 400)
        
        try:
            port = Port.objects.get(microcontroller = microcontroller)
        except Port.DoesNotExist:
            return Response(status = 400)
        
        try:
            if password == microcontroller.key:
                samePassword = 1
            else:
                samePassword = 0
        except ValueError:
            return Response(status = 400)
        
        if samePassword == 0:
            return Response(status = 400)
        else:
            port.currentStatus = currentStatus
            port.save()
            return Response(status = 204)


class ExecuteCommand(APIView):
    queryset = Port.objects.all()
    
    def put(self, request):
        data = request.data
        try:
            id = data["target"]
            command = data["command"]
        except KeyError:
            return Response(status = 400)
        
        try:
            brightness = data["brightness"]
        except KeyError:
            brightness = None
        
        try:
            rgb = data["rgb"]
        except KeyError:
            rgb = None
            
        try:
            microcontroller = Microcontroller.objects.get(pk = id)
        except Microcontroller.DoesNotExist:
            return Response(status = 400)

        email = Account.objects.get(microcontroller = microcontroller).email
        
        try:
            commandOption = CommandOption.objects.filter(key = "command", value = command)
        except CommandOption.DoesNotExist:
            return Response(status = 400)
        
        testcl = PythonClientPub()

        testcl.publish_command(email, id, command, brightness, rgb)
        
        return Response(status = 204)
        
    
"""
teststring:
{
    "target" : 1,
    "command" : "changeLampBrightness",
    "brightness" : 0,
    "rgb" : 0
}
"""