from ..model.account import Account
from bcrypt import hashpw, gensalt, checkpw

from rest_framework.views import APIView
from rest_framework.response import Response

class Login(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        data = request.data[0]
        password = data["password"].encode("utf-8")
        email = data["email"]
        account = Account.objects.filter(email = email)
        if account:
            savedPassword = account[0].password.encode("utf-8")
            if (checkpw(password, savedPassword) == True):
                # muss noch zuende implementiert werden
                return Response(status = 200)
            else:
                return Response(status = 400)
        else: 
            return Response(status = 400)