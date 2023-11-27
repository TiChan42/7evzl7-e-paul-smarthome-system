from ..model.user import User
from ..serializer.userSerializer import UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class UserView(APIView):
    queryset = User.objects.all()

    def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many = True)
        return Response(serializer.data, status = 200)


class SingleUserView(APIView):
    queryset = User.objects.all()

    def get(self, request, userid):
        user = User.objects.get(pk = userid)
        serializer = UserSerializer(user)
        return Response(serializer.data, status = 200)
    
    def delete(self, request, userid):
        user = User.objects.get(pk = userid)
        user.delete()
        return Response('User erfolgreich gelöscht')
    
