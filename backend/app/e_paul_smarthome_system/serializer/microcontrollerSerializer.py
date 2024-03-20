from ..model.microcontroller import Microcontroller
from ..serializer.portSerializer import PortSerializer
from rest_framework import serializers


class MicrocontrollerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microcontroller
        fields = ['id','name','type']
        
class MicrocontrollerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microcontroller
        fields = ['id','key']


class MicrocontrollerPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microcontroller
        fields = ['port']
    
    port = PortSerializer(many = True)