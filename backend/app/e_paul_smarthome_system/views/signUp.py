from ..model.account import Account
from ..model.user import User

from rest_framework.views import APIView
from rest_framework.response import Response

from bcrypt import hashpw, gensalt, checkpw

class SignUp(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        data = request.data
        email = data["email"]
        password = data["password"]
        wdhPassword = data["passwordRepeat"]

        def accountExists(email):
            if Account.objects.filter(email=email):
                return 1
            else:
                return 0

        if(accountExists(email)==0 and password==wdhPassword):
            password = password.encode("utf-8")
            passwordHash = hashpw(password, salt=gensalt())
            password = passwordHash.decode("utf-8")
            account = Account(password=password,email = email)
            account.save()
            return Response(status=201)
        else:
            return Response(status=400)
        
"""     
for testing purposes    
{
"email" : "test",
"password" : "435",
"passwordRepeat" : "435"
}
"""

class CreateUser(APIView):
    queryset = User.objects.all()
    
    def post(self, request):
        data = request.data
        username = data["username"]
        pin = data["pin"]
        accountId = data["accountId"]

        try:
            account = Account.objects.get(id=accountId)
        except Account.DoesNotExist:
            return Response(status=400)
        
        try: 
            if (Account.objects.filter(id=accountId, user__isnull = False)):
                noUser = False
            else:
                noUser = True
        except Account.DoesNotExist:
            noUser = True 
        
        def userExists(accountId, username):
            if Account.objects.filter(id=accountId, user__username=username):
                return 1
            else:
                return 0

        if(noUser == True):
            pin = pin.encode("utf-8")
            pinHash = hashpw(pin, salt=gensalt())
            pin = pinHash.decode("utf-8")
            user = User(username = username, pin = pin, account = account, role = 'superuser')
            user.save()
            return Response(status = 201)
        elif(userExists(accountId, username)==0):
            pin = pin.encode("utf-8")
            pinHash = hashpw(pin, salt=gensalt())
            pin = pinHash.decode("utf-8")
            user = User(username = username, pin = pin, account = account, role ='user')
            user.save()
            return Response(status=201)
        else:
            return Response(status=400)
        
"""
for testing purposes
{
"accountId" : 2,
"username" : "Zelda",
"pin" : "187" 
}
"""