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
        queryset = User.objects.get(pk = userid)
        serializer = UserSerializer(queryset)
        return Response(serializer.data, status = 200)
    
