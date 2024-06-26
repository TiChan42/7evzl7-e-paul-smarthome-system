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
        
        


class DeleteUserView(APIView):
    queryset = User.objects.all()

    def post(self, request):
        try:
            userid = request.data["userId"]
            executingUserId = request.data["executingUserId"]
            accountId = request.data["accountId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(pk = userid)
            executingUser = User.objects.get(pk = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        try:
            account = Account.objects.filter(pk = accountId, user__id__in=[userid, executingUserId]).distinct()
        except Account.DoesNotExist:
            return Response(status = 400)
        
        if account.count() != 1:
            return Response(status = 400)

        if user.role == "superuser":
            return Response('Superuser kann nicht gelöscht werden', status=400)
        

        if ((userid == executingUserId) and (user.rights["mayDeleteSelf"] == 1)) or (executingUser.rights["mayDeleteUser"] == 1):
            user.delete()
            return Response('User erfolgreich gelöscht', status = 204)
        else:
            return Response(status = 400)
        
"""
{
"userId" : 2,
"executingUserId" : 1,
"accountId" : 2
}
"""
