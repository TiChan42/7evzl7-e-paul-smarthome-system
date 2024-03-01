from ..model.user import User
from ..model.account import Account
from ..serializer.userSerializer import UserDetailSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

from bcrypt import hashpw, gensalt, checkpw

class RightsSettings(APIView):
    queryset = User.objects.all()
    
    def get(self, request):
        user = User.objects.all()
        serializer = UserSerializer(user, many = True)
        return Response(serializer.data, status = 200)
    
    def post(self, request):
        superUserId = request.data["superUserId"]
        user = User.objects.get(pk = superUserId)
        if user is None:
            return Response(status = 400)
        if user.role == "superuser":
            user = User.objects.get(pk = request.data["userId"])
            if user is None:
                return Response(status = 400)
            user.changeRights(request.data["rights"])   
            userSerializer = UserDetailSerializer(user)
            return Response(userSerializer.data ,status = 200)
        else: 
            return Response(status = 400)


"""
Teststring:
{
    "superUserId" : 3,
    "userId" : 1,
    "rights" : {"userSettings" : 1, 
        "adduser" : 1, "deleteuser" : 1, 
        "userManagement" : 1, 
        "deviceManagement" : 1, 
        "deviceSettings" : 1, 
        "addDevice" : 1, 
        "deleteDevice" : 1, 
        "addRightsController" : 1, 
        "promoteUser" : 1, 
        "demoteUser" : 1
        }
}
"""

class SingleUserSettingsView(APIView):
    queryset = User.objects.all()

    def get(self, request, userid):
        user = User.objects.get(pk = userid)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status = 200)

    def put(self, request, userid):
        user = User.objects.get(pk = userid)
        #account = user.account
        accountId = request.data["accountId"]
        gender = request.data["gender"]
        newUsername = request.data["username"]    
        account = Account.objects.get(id=accountId)

        # check if new username is unique in given account
        def uniqueUsername(username, accountId):
            try:
                accountExists = Account.objects.get(pk = accountId).user.get(username = username)
            except:
                accountExists = None
            if accountExists:
                return 1
            else:
                return 0
            
        if newUsername is not None and uniqueUsername(newUsername, account.id)==0:
            user.username = newUsername
            user.gender = gender
            user.save()
            return Response(status = 200)
        elif uniqueUsername(newUsername, account.id)==1:
            return Response("Username existiert bereits.", status=400)
        else:
            return Response(status = 400)

"""
{
    "accountId" : "1",
    "username" : "dnaiajvöio",
    "gender" : "männlich"
} 
"""

class ChangePin(APIView):
    queryset = User.objects.all()

    def put(self, request):
        userid = request.data["id"]
        user = User.objects.get(pk = userid)
        pin = request.data["pin"]
        userPin = user.pin
        if not bool(userPin):   
            if not bool(pin):
                user.pin = user.__class__._meta.get_field('pin').default
                user.save()
                return Response(status = 200)  
            pin = pin.encode("utf-8")
            pinHash = hashpw(pin, salt=gensalt())
            pin = pinHash.decode("utf-8")
            user.pin = pin
            user.save()
            return Response(status = 200)
        else: 
            oldPin = request.data["previousPin"]
            if checkpw(oldPin.encode("utf-8"), userPin.encode("utf-8")):
                if not bool(pin):
                    user.pin = user.__class__._meta.get_field('pin').default
                    user.save()
                    return Response(status = 200) 
                pin = pin.encode("utf-8")
                pinHash = hashpw(pin, salt=gensalt())
                pin = pinHash.decode("utf-8")
                user.pin = pin
                user.save()
                return Response(status = 200)
            
"""
Teststring:
{
    "id" : 16,
    "pin" : "1234",
    "previousPin" : "1234"
}
"""