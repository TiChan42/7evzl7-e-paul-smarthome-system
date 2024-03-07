from ..model.account import Account
from ..serializer.accountSerializer import AccountUserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response


class GetUser(APIView):
    queryset = Account.objects.all()
    
    def get(self, request, accountId):
        account = Account.objects.get(pk = accountId)
        if account:
            serializer = AccountUserSerializer(account)
            return Response(serializer.data, status = 200)
        else:
            return Response(status = 400)