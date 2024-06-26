from ..model.account import Account
from ..model.group import Group
from ..model.port import Port
from ..model.user import User
from ..model.command import Command
from ..model.commandOption import CommandOption
from ..model.scene import Scene

from ..serializer.accountSerializer import AccountUserSerializer
from ..serializer.groupSerializer import GroupSerializer
from ..serializer.portSerializer import PortSerializer, PortIdSerializer
from ..serializer.commandSerializer import CommandSerializer
from ..serializer.commandOptionSerializer import CommandOptionSerializer
from ..serializer.sceneSerializer import SceneSerializer

from rest_framework.views import APIView
from rest_framework.response import Response


class GetUsers(APIView):
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

class GetCommands(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, portId):
        try:
            commands = Command.objects.filter(portTemplate__port__id = portId)
        except Command.DoesNotExist:
            return Response(status = 400)
        
        serializer = CommandSerializer(commands, many = True)

        #serializer = CommandSerializer(command, many = True)
        return Response(serializer.data, status = 200)

class GetScenes(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, groupId):
        try:
            scenes = Scene.objects.filter(group__id = groupId)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        serializer = SceneSerializer(scenes, many = True)
        return Response(serializer.data, status = 200)


class GetEmails(APIView):
    queryset = Account.objects.all()
    
    def get(self, request):
        accounts = Account.objects.all()
        emails = []
        for account in accounts:
            emails.append(account.email)
        return Response({"emails": emails}, status = 200)
    

class GetScenePorts(APIView):
    queryset = Scene.objects.all()
    
    def get(self, request, sceneId):
        try:
            scene = Scene.objects.get(pk = sceneId)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        ports = Port.objects.filter(state__scene = scene)
        
        scenePorts = [port.id for port in ports]
        
        return Response({"ids": scenePorts}, status = 200)