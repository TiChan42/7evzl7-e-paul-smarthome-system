from ..model.scene import Scene

from rest_framework import serializers
from rest_framework.serializers import JSONField

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = ['id', 'state']
    
    state = JSONField()