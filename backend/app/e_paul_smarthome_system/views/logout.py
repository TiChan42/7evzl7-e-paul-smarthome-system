from ..model.account import Account

from rest_framework.views import APIView
from rest_framework.response import Response

class Logout(APIView):
    queryset = Account.objects.all()
    def post(self, request):
        accountId = request.data["accountId"]
        try:
            account = Account.objects.get(pk = accountId)
        except Account.DoesNotExist:
            return Response(status = 400)
        
        return Response(status = 204)
          