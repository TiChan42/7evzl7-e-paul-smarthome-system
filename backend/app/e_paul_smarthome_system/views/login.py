from ..model.account import Account
from bcrypt import hashpw

from rest_framework.views import APIView
from rest_framework.response import Response

class Login(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        data = request.POST.data
        password = data["password"]
        email = data["email"]
        passwordHash = hashpw(password)
        account = Account.objects.filter(email = email)
        if account["password"] == passwordHash:
            # muss noch zuende implementiert werden
            return 1
        