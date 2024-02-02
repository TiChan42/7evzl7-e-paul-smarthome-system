from ..model.user import User
from ..model.account import Account
from ..serializer.userSerializer import UserSerializer, UserDetailSerializer, UserEditSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class UserView(APIView):
    queryset = User.objects.all()

    def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many = True)
        return Response(serializer.data, status = 200)


class SingleUserView(APIView):
    queryset = User.objects.all()

    def get(self, request, userid):
        user = User.objects.get(pk = userid)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status = 200)
        
 

    def delete(self, request, userid):
        user = User.objects.get(pk = userid)
        user.delete()
        return Response('User erfolgreich gelöscht')
    

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