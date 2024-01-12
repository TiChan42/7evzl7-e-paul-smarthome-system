from ..model.microcontroller import Microcontroller
from rest_framework import serializers

class MicrocontrollerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microcontroller
        fields = ['id','name','ip','filter']
