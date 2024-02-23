from ..model.account import Account
from ..serializer.accountSerializer import AccountMicrocontrollerSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class DeviceView(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        id = request.data['accountId']
        queryset = Account.objects.get(pk = id)
        serializer = AccountMicrocontrollerSerializer(queryset)
        return Response(serializer.data, status = 200)

"""
teststring
{
    "accountId" : 1
}
"""