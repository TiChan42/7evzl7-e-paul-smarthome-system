from ..model.group import Group
from ..model.port import Port
from ..model.groupPort import GroupPort
from ..model.account import Account
from ..model.user import User

from ..serializer.userSerializer import UserGroupSerializer
from ..serializer.portSerializer import PortSerializer
from ..serializer.accountSerializer import AccountPortSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class AddGroup(APIView):
    queryset = Group.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            userId = data["userId"]
            name = data["name"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = userId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        group = Group(name = name, groupType = "Standard", user = user)
        group.save()
        
        return Response(status = 201)

"""
teststring
{
"userId" : 1,
"name" : "Test"
}
"""
class DeleteGroup(APIView):
    queryset = Group.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            userId = data["userId"]
            groupId = data["groupId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            group = Group.objects.get(id = groupId, user__id = userId)
        except Group.DoesNotExist:
            return Response(status = 400)

        if group.groupType == "Assignment" or group.groupType == "Favorite":
            return Response("Assignment oder Favorite dürfen nicht gelöscht werden", status = 400)
        group.delete()
        return Response(status = 204)
"""
Teststring
{
"userId" : 1,
"groupId" : 1
}
"""

class AddPortToGroup(APIView):
    queryset = Group.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            userId = data["userId"]
            groupId = data["groupId"]
            portId = data["portId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            group = Group.objects.get(pk = groupId)
        except Group.DoesNotExist:
            return Response(status = 400)
        
        try: 
            port = Port.objects.get(pk = portId)
        except Port.DoesNotExist:
            return Response(status = 400)
        
        try:
            account = Account.objects.get(user = userId, microcontroller__port = portId)
        except Account.DoesNotExist:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = userId, group = groupId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        if user.rights["mayEditController"] == 1:
            groupPort = GroupPort(group = group, port = port)
            groupPort.save()
            return Response(status = 201)
        else:
            return Response(status = 400)

"""
teststring
{
"userId" : 1,
"groupId" : 2,
"portId": 2
}
"""
    
class RemovePortFromGroup(APIView):
    queryser = Group.objects.all()
    def post(self, request):
        data = request.data
        
        try:
            userId = data["userId"]
            executingUserId = data["executingUserId"]
            groupId = data["groupId"]
            portId = data["portId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            groupPort = GroupPort.objects.get(group__id = groupId, port__id = portId)
        except GroupPort.DoesNotExist:
            return Response(status = 400)
        
        try:
            user = User.objects.get(pk = userId)
            executingUser = User.objects.get(pk = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        if executingUser.rights["mayDeleteControllers"] == 1:
            groupPort.delete()
            return Response(status = 204)
        else:
            return Response(status = 400)