from ..model.group import Group

from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Group
        fields = ['id','groupType']
        