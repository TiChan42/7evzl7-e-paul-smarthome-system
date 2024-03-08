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

class AddPortToGroup(APIView):
    queryset = Group.objects.all()
    
    def get(self, request, userId):
        groupQueryset = User.objects.get(id = userId)
        groupSerializer = UserGroupSerializer(groupQueryset)
        
        portQueryset = Account.objects.get(user = userId)
        portSerializer = AccountPortSerializer(portQueryset)
        
        return Response({"Groups" : groupSerializer.data,
                         "Ports" : portSerializer.data}, status = 200)
    
    
    def post(self, request, userId):
        data = request.data
        
        try:
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
        
        groupPort = GroupPort(group = group, port = port)
        groupPort.save()
        return Response(status = 201)