from ..model.account import Account

from rest_framework.views import APIView
from rest_framework.response import Response

class AboutUsView(APIView):
    queryset = Account.objects.all()

    def get(self, request):
        queryset = Account.objects.all().count()
        return Response({"accounts": queryset})