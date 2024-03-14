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
    
class DeleteAccount(APIView):
    queryset = Account.objects.all()
    
    def post(self, request):
        try:
            accountId = request.data["accountId"]
            executinguserId = request.data["executingUserId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            account = Account.objects.get(id = accountId)
        except Account.DoesNotExist:
            return Response(status = 400)
        
        try:
            executingUser = Account.objects.get(id = executinguserId)
        except Account.DoesNotExist:
            return Response(status = 400)
        
        if executingUser.rights["mayChangeAccountSettings"] == 1:
            account.delete()
            return Response(status = 202)
        else:
            return Response(status = 400)