from ..model.account import Account
from ..model.user import User

from rest_framework.views import APIView
from rest_framework.response import Response

from bcrypt import hashpw, gensalt

class SignUp(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        data = request.data[0]
        email = data["email"]
        password = data["password"]
        wdhPassword = data["wdhPassword"]
        firstname = data["firstname"]
        lastname = data["lastname"]
        username = data["username"]
        pin = data["pin"]


        def accountExists(email):
            if Account.objects.filter(email=email):
                return 1
            else:
                return 0

        if(accountExists(email)==0 and password==wdhPassword):
            password = password.encode("utf-8")
            passwordHash = hashpw(password, salt=gensalt())
            password = passwordHash.decode("utf-8")
            account = Account(password=password,email = email, firstname=firstname, lastname = lastname,)
            user = User(username = username,account = account, pin = pin)
            account.save()
            user.save()
            return Response(status=201)
        else:
            return Response(status=400)
        
"""     
for testing purposes    
[{
"email" : "test",
"password" : "435",
"wdhPassword" : "435",
"firstname" : "Robin",
"lastname" : "Beetz",
"username" : "Link",
"pin": 325
}]
"""

