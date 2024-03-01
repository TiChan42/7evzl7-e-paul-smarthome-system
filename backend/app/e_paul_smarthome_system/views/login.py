from ..model.account import Account
from ..model.user import User

from ..serializer.loginSerializer import LoginAccountSerializer, LoginUserSerializer

from bcrypt import checkpw

from rest_framework.views import APIView
from rest_framework.response import Response

class Login(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        data = request.data
        password = data["password"].encode("utf-8")
        email = data["email"]
        try: 
            account = Account.objects.get(email = email)
        except Account.DoesNotExist:
            return Response({"falseEmailPassword" : 0},status = 400)
        if account:
            savedPassword = account.password.encode("utf-8")
            try:
                samePassword = checkpw(password, savedPassword)
            except ValueError:
                return Response({"falseEmailPassword": 0},status = 400)
            if (samePassword == 1):
                serializer = LoginAccountSerializer(account)
                # muss noch zuende implementiert werden
                return Response(serializer.data, status = 200)
            else:
                return Response({"falseEmailPassword": 0},status = 400)
        else: 
            return Response({"falseEmailPassword": 0}, status = 400)
        
"""
{
"password":"435",
"email":"test"
}
"""

class LoginUser(APIView):
    queryset = User.objects.all()
    
    def post(self, request):
        data = request.data
        accountId = data["accountId"]
        username = data["username"]
        try: 
            pin = data["pin"].encode("utf-8")
        except KeyError:
            pin = None
        try:
            user = User.objects.get(account = accountId, username = username)
        except User.DoesNotExist:
            return Response(status = 400)
        if user:
            if not bool(pin):
                serializer = LoginUserSerializer(user)
                return Response(serializer.data, status = 200)
            else:
                savedpin = user.pin.encode("utf-8")
                try:
                    samePin = checkpw(pin, savedpin)
                except ValueError:
                    return Response(status = 400)
                if (samePin == 1):
                    serializer = LoginUserSerializer(user)
                    return Response(serializer.data, status = 200)
        else:
            return Response(status = 400)
        
"""
for testing purposes
{
"accountId" : 1,
"username" : "Link",
"pin" : "325" 
}
"""