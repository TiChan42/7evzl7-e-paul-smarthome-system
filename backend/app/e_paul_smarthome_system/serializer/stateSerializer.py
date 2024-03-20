from ..model.scene import Scene

from rest_framework import serializers

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = ['id', 'state']
    
    