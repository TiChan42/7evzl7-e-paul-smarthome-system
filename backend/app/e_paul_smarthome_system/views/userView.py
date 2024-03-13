from ..model.user import User
from ..model.account import Account
from ..model.group import Group
from ..model.port import Port
from ..model.groupPort import GroupPort
from ..serializer.userSerializer import UserSerializer, UserDetailSerializer, UserEditSerializer

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

    def get(self, request, userId):
        try:
            user = User.objects.get(pk = userId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status = 200)
        
    def delete(self, request, userId):
        try:
            user = User.objects.get(pk = userId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        if user.role == "superuser":
            return Response('Superuser kann nicht gelöscht werden', status=400)
        
        user.delete()
        return Response('User erfolgreich gelöscht')
    
