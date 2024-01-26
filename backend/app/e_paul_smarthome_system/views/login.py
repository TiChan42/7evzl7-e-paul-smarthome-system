from ..model.account import Account

from ..serializer.loginSerializer import LoginAccountSerializer

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
            try:
                samePassword = checkpw(password, savedPassword)
            except ValueError:
                return Response(status = 400)
            if (samePassword == 1):
                serializer = LoginAccountSerializer(account, many = True)
                # muss noch zuende implementiert werden
                return Response(serializer.data, status = 200)
            else:
                return Response(status = 400)
        else: 
            return Response(status = 400)