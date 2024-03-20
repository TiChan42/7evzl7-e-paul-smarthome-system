from ..model.account import Account
from ..model.user import User

from rest_framework.views import APIView
from rest_framework.response import Response

class AboutUsView(APIView):
    queryset = Account.objects.all()

    def get(self, request):
        accounts = Account.objects.all().count()
        users = User.objects.all().count()
        return Response({"accounts": accounts, "users": users}, status=200)