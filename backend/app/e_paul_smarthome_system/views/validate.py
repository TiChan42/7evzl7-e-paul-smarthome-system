from ..model.account import Account
from ..model.user import User

from rest_framework.views import APIView
from rest_framework.response import Response

from bcrypt import checkpw

class ValidatePin(APIView):
    queryset = Account.objects.all()
    
    def post(self, request):
        accountId = request.data["accountId"]
        userId = request.data["userId"]
        pin = request.data["pin"].encode("utf-8")
        account = Account.objects.get(pk = accountId)
        
        #user = account.user.get(pk = userId)
        user = User.objects.filter(account__id= accountId).get(id = userId)
        
        savedpin = user.pin.encode("utf-8")
        try:
            samePin = checkpw(pin, savedpin)
        except ValueError:
            return Response(status = 400)     
        
        if samePin == 1:
            return Response({"valid" : 1},status = 200)
        if samePin == 0:
            return Response({"valid" : 0},status = 200)
        else:
            return Response(status = 400)
        
class CheckPinRequired(APIView):
     queryset = User.objects.all()

     def get(self, request, userid):
         user = User.objects.get(pk = userid)
         userPin = user.pin
         if not bool(userPin):
             return Response({"Required" : False}, status = 200) 
         else: 
             return Response({"Required" : True}, status = 200)
         


        
# User.objects.get(id = userId) | User.objects.get(account__id = accountId)
"""
Teststring:
{
    "accountId" : 3,
    "userId" : 4,
    "pin" : "187"
}
"""

class ValidateEmail(APIView):
    queryset = Account.objects.all()
    
    def post(self, request):
        key = request.data["key"].encode("utf-8")
        id = request.data["accountId"]
        try:
            account = Account.objects.get(pk = id)
        except Account.DoesNotExist:
            return Response(status = 400)
        if account.emailVerified == True:
            return Response({"AlreadyVerified" : 1}, status = 400)
        else:
            try:
                savedKey = account.key.encode("utf-8")
                sameKey = checkpw(key, savedKey)
            except ValueError:
                return Response(status = 400)  
            if sameKey == 1:
                account.emailVerified = True
                account.save()
                return Response("Deine Email wurde erfolgreich verifiziert", status = 200)
            else:
                return Response({"WrongKey": 1}, status = 400)