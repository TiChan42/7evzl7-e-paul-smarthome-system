from ..model.group import Group
from ..serializer.userSerializer import  UserSerializer
from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description', 'kindOf','user']
    
    user = UserSerializer(many=True)