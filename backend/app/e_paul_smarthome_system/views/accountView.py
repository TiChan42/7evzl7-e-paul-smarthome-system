from ..model.account import Account
from ..serializer.accountSerializer import AccountSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class AccountView(APIView):
    queryset = Account.objects.all()

    def get(self, request):
        queryset = Account.objects.all()
        serializer = AccountSerializer(queryset, many = True)
        return Response(serializer.data, status = 200)