from ..model.user import User
from ..model.account import Account
from ..model.group import Group
from ..model.port import Port
from ..model.groupPort import GroupPort

from ..serializer.userSerializer import UserDetailSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

import re
from bcrypt import hashpw, gensalt, checkpw

class RightsSettings(APIView):
    queryset = User.objects.all()
       
    def put(self, request):
        try:
            userRightKey = request.data["userRightKey"]
            value = request.data["value"]
            userId = request.data["userId"]
            executingUserId = request.data["executingUserId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(pk = userId)
            executingUser = User.objects.get(pk = executingUserId)      
        except User.DoesNotExist:
            return Response(status = 400)  
           
        if executingUser.rights["mayChangeUserRights"] == 1 and executingUser.role != "user" and user.role != "superuser" and user.id != executingUser.id:
            user.rights[userRightKey] = value
            user.save()
            return Response(status = 202)
        else: 
            return Response(status = 400)


"""
Teststring:
{
    "superUserId" : 3,
    "userId" : 1,
    "rights" : { 
        "mayChangeUserSettings" : 1,
        "mayDeleteUser" : 1,
        "mayAssignController" : 1,
        "mayChangeUserType" : 1,
        "mayChangeUserRights" : 1,
        
        "mayAddUser" : 1,
        "mayChangeAccountSettings" : 1,
        
        "mayChangeOwnUserSettings" : 1,
        "mayDeleteSelf" : 1,
        
        "mayEditControllers" : 1,
        "mayDeleteControllers" : 1
        }
}
"""

class SingleUserSettingsView(APIView):
    queryset = User.objects.all()

    def put(self, request):
        
        try:
            userId = request.data["userId"]
            accountId = request.data["accountId"]
            executingUserId = request.data["executingUserId"]
        except KeyError:
            return Response(status = 400)
        
        try: 
            gender = request.data["gender"]
        except KeyError:
            gender = None
        
        try:
            newUsername = request.data["username"]    
        except KeyError:
            newUsername = None
        
                
        try:
            account = Account.objects.get(id=accountId)
        except Account.DoesNotExist:
            return Response(status = 400)
        
        try:
            user = User.objects.get(pk = userId)
            executingUser = User.objects.get(pk =  executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)    
        
        try:
            usernameExists = User.objects.get(username = newUsername, account = account)
        except User.DoesNotExist:
            usernameExists = None

        if ((userId == executingUserId) and (user.rights["mayChangeOwnUserSettings"] == 1) or (executingUser.rights["mayChangeUserSettings"] == 1)):   
            if newUsername and usernameExists == None and gender:
                user.username = newUsername
                user.gender = gender
                user.save()
                return Response(status = 204)
            elif newUsername and usernameExists == None and not gender:
                user.username = newUsername
                user.save()
                return Response(status = 204)
            elif not newUsername and gender:
                user.gender = gender
                user.save()
                return Response(status = 204)
            elif usernameExists:
                return Response({"error":"Username existiert bereits."}, status=400)
            else:
                return Response(status = 400)
        else:
            return Response(status = 400)

"""
{
    "accountId" : "5",
    "executingUserId" : "1", 
    "username" : "testuser1",
    "gender" : "männlich"
} 
"""

class ChangePin(APIView):
    queryset = User.objects.all()

    def put(self, request):
        try: 
            userid = request.data["userId"]
            executingUserId = request.data["executingUserId"]
            pin = request.data["pin"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(pk = userid)
            executingUser = User.objects.get(pk = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)

        if (((userid == executingUserId) and (user.rights["mayChangeOwnUserSettings"] == 1)) or ((executingUser.rights["mayChangeUserSettings"] == 1) and (user.role != "superuser"))):
            if user.role == "superuser" or user.role == "admin":
                check = re.match(r"\b\d{3,32}\b", pin)
            else:
                check = pin
            
            if check:
                pin = pin.encode("utf-8")
                pinHash = hashpw(pin, salt=gensalt())
                pin = pinHash.decode("utf-8")
                user.pin = pin
                user.save()
                return Response(status = 204)    
            
            if not bool(pin):
                user.pin = user.__class__._meta.get_field('pin').default
                user.save()
                return Response(status = 200)  
            else:
                return Response(status = 400) 
        else:
            return Response(status = 400)  
"""
Teststring:
{
    "userId" : 16,
    "pin" : "1234",
    "previousPin" : "1234"
}
"""

class ChangeRole(APIView):
    queryset = User.objects.all()

    def put(self, request):
        try:
            userId = request.data["userId"] 
            executingUserId = request.data["executingUserId"]
            role = request.data["role"]
        except KeyError:
            return Response(status = 400)
        
        if role == "superuser":
            return Response('Es kann nur einen Superuser geben', status=400)
        
        try:
            user = User.objects.get(pk = userId)
            executingUser = User.objects.get(pk = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)

        if executingUser == user or user.role == "superuser":
            return Response(status = 400)
        
        if executingUser.rights["mayChangeUserType"] == 1:
            if role == "admin":
                user.role = role
                user.save()
                group = Group.objects.get(user__id = user.id, groupType = "Assignment")
                
                ports = Port.objects.filter(groupPort__group__user__id = executingUser.id, groupPort__group__groupType = 'Assignment')
                for port in ports:
                    if GroupPort.objects.filter(group__id = group.id, port__id = port.id).exists() == False:
                        groupPort = GroupPort(group = group, port = port)
                        groupPort.save()
                    else:
                        continue
                return Response(status = 204)
            elif role == "user":
                user.role = role
                user.save()
                return Response(status = 204)
            else:
                return Response(status = 400)
        else:
            return Response(status = 400)
        
"""
teststring
{
"userId" : 1,
"executingUserId" : 2,
"role" : "admin"
}
"""

class ChangeMail(APIView):
    queryset = Account.objects.all()

    def put(self, request):
        try:
            userId = request.data["userId"]
            accountId = request.data["accountId"]
            email = request.data["email"]
        except KeyError:
            return Response(status = 400)
        
        try:
            account = Account.objects.get(pk = accountId)
        except Account.DoesNotExist:
            return Response(status = 400)
        
        try:
            user = User.objects.get(pk = userId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        if user.rights["mayChangeAccountSettings"] == 1:
            account.email = email
            account.save()
            return Response(status = 204)
        else:
            return Response(status = 400)
