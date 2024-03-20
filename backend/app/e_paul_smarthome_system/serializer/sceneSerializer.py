from ..model.scene import Scene

from ..serializer.stateSerializer import StateSerializer

from rest_framework import serializers

class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = ['id', 'name', 'state']
    
    state = StateSerializer(many = True)
    
    