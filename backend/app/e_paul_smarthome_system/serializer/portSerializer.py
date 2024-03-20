from ..model.port import Port

from rest_framework import serializers

class PortSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = Port
        fields = ['id','type', 'name']


class PortIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = ['id']             