from ..model.account import Account
from ..model.user import User

from rest_framework.views import APIView
from rest_framework.response import Response

from bcrypt import hashpw, gensalt

class SignUp(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        email = request.data[0]["email"]
        password = request.data[0]["password"]
        wdhPassword = request.data[0]["wdhPassword"]
        firstname = request.data[0]["firstname"]
        lastname = request.data[0]["lastname"]
        username = request.data[0]["username"]
        pin = request.data[0]["pin"]


        def accountExists(email):
            if Account.objects.filter(email=email):
                return 1
            else:
                return 0

        if(accountExists(email)==0 and password==wdhPassword):
            password = password.encode("utf-8")
            passwordHash = hashpw(password, salt=gensalt())
            account = Account(password=passwordHash,email = email, firstname=firstname, lastname = lastname,)
            user = User(username = username,account = account, pin = pin)
            account.save()
            user.save()
            return Response(status=201)


