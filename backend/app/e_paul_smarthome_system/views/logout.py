from ..model.account import Account

from rest_framework.views import APIView
from rest_framework.response import Response

class Logout(APIView):
    queryset = Account.objects.all()
    def logout(self, request):
        account = Account.objects.filter()

        