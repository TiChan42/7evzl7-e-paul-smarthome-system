from ..model.group import Group
from ..serializer.groupSerializer import GroupSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class GroupView(APIView):
    queryset = Group.objects.all()

    def get(self, request):
        queryset = Group.objects.all()
        serializer = GroupSerializer(queryset, many = True)
        return Response(serializer.data, status = 200)