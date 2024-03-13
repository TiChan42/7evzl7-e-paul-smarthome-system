from ..model.account import Account
from ..model.group import Group
from ..model.port import Port
from ..model.user import User

from ..serializer.accountSerializer import AccountUserSerializer, AccountPortSerializer
from ..serializer.groupSerializer import GroupSerializer
from ..serializer.portSerializer import PortSerializer, PortIdSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class GetUser(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, accountId):
        account = Account.objects.get(pk = accountId)
        if account:
            serializer = AccountUserSerializer(account)
            return Response(serializer.data, status = 200)
        else:
            return Response(status = 400)
        
class GetVerified(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, accountId):
        try:
            account = Account.objects.get(pk = accountId)
        except Account.DoesNotExist:
            return Response(status = 400)
        if account.emailVerified == True:
            return Response({"verified" : 1}, status = 200)
        else:
            return Response({"verified" : 0}, status = 200)

class GetGroups(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, type, userId):
        try:
            group = Group.objects.filter(user__id = userId, groupType = type)
        except Group.DoesNotExist:
            return Response(status = 400)
        
        match type:
            case "Assignment" | "Favorite":
                port = Port.objects.filter(groupPort__group__id = group[0].id)
                portSerializer = PortIdSerializer(port, many = True)
                groupSerializer = GroupSerializer(group[0])
                ids = []
                for data in portSerializer.data:
                    ids.append(data["id"])
                return Response([groupSerializer.data, ids], status = 200)
            case "Standard":
                values = []
                serializer = GroupSerializer(group, many = True)
                for group in serializer.data:
                    port = Port.objects.filter(groupPort__group__id = group["id"])
                    portSerializer = PortIdSerializer(port, many = True)
                    ids = []
                    for data in portSerializer.data:
                        ids.append(data["id"])
                    group["port"] = ids
                    values.append(group)
                return Response(values, status = 200)
            case _:
                return Response(status = 400)
        
class GetPorts(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, accountId):
        try:
            port = Port.objects.filter(microcontroller__account__id = accountId)
        except Port.DoesNotExist:
            return Response(status = 400)
            
        if port:
            serializer = PortSerializer(port, many = True)
            return Response(serializer.data, status = 200)
        else:
            return Response(status = 400)
        

class GetUserRights(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, userId, executingUserId):
        try:
            user = User.objects.get(pk = userId)
            executingUser = User.objects.get(pk = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        if user == executingUser: 
            return Response(user.rights, status = 200)
        elif executingUser.rights["mayChangeUserRights"] == 1:
            return Response(user.rights, status = 200)
        else:
            return Response(status = 400)
