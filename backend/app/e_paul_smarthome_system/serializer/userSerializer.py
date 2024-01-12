from ..model.user import User
from rest_framework import serializers
from .microcontrollerSerializer import MicrocontrollerSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','firstname','lastname','email','password','key','gender','birthdate']
  
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','firstname','lastname','email','password','key','gender','birthdate','microcontroller']
    microcontroller = MicrocontrollerSerializer(many=True)
