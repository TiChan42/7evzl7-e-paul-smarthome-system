from ..model.user import User
from ..serializer.userSerializer import UserDetailSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class RightsSettings(APIView):
    queryset = User.objects.all()
    
    def get(self, request):
        user = User.objects.all()
        serializer = UserSerializer(user, many = True)
        return Response(serializer.data, status = 200)
    
    def post(self, request):
        superUserId = request.data["superUserId"]
        user = User.objects.get(pk = superUserId)
        if user is None:
            return Response(status = 400)
        if user.role == "superuser":
            user = User.objects.get(pk = request.data["userId"])
            if user is None:
                return Response(status = 400)
            user.changeRights(request.data["rights"])   
            userSerializer = UserDetailSerializer(user)
            return Response(userSerializer.data ,status = 200)
        else: 
            return Response(status = 400)


"""
Teststring:
{
    "superUserId" : 3,
    "userId" : 1,
    "rights" : {"userSettings" : 1, 
        "adduser" : 1, "deleteuser" : 1, 
        "userManagement" : 1, 
        "deviceManagement" : 1, 
        "deviceSettings" : 1, 
        "addDevice" : 1, 
        "deleteDevice" : 1, 
        "addRightsController" : 1, 
        "promoteUser" : 1, 
        "demoteUser" : 1
        }
}
"""