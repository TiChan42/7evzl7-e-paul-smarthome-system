from ..model.user import User
from ..serializer.userSerializer import UserHomeSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class HomeView(APIView):
    queryset = User.objects.all()
    
    def get(self, request, userId):
        user = User.objects.get(pk = userId)
        serializer = UserHomeSerializer(user)
        return Response(serializer.data, status = 200)
    
