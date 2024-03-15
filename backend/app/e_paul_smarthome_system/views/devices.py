from ..model.account import Account
from ..model.microcontroller import Microcontroller
from ..model.port import Port

from ..serializer.accountSerializer import AccountMicrocontrollerSerializer
from ..serializer.microcontrollerSerializer import MicrocontrollerSerializer

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


class AddPort(APIView):
    queryset = Microcontroller.objects.all()

    def get(self, request):
        queryset = Microcontroller.objects.all()
        serializer = MicrocontrollerSerializer(queryset, many = True)
        return Response(serializer.data, status = 200)
        
    
    def post(self, request):
        data = request.data
        try:
            id = data["microcontrollerId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            microcontroller = Microcontroller.objects.get(pk = id)
        except Microcontroller.DoesNotExist:
            return Response(status = 404)
        
        if data["type"]:
            type = data["type"]
            port = Port(type = type, microcontroller = microcontroller)
            port.save()
            return Response(status = 201)
        else: 
            port = Port(type = "controller", microcontroller = microcontroller)
            port.save()
            return Response({"message":"Der Port wurde automatisch auf controller gesetzt"} ,status = 201)
"""
teststring
{
    "microcontrollerId" : 1,
    "type" : "test"
}

"""