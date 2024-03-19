from ..model.scene import Scene

from ..serializer.stateSerializer import StateSerializer

from rest_framework import serializers

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = ['id', 'state']
    
    