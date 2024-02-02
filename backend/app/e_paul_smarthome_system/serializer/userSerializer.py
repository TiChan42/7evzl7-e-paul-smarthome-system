from ..model.user import User
from rest_framework import serializers
from .microcontrollerSerializer import MicrocontrollerSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','pin','key','gender','birthdate']
  
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','pin','key','gender','birthdate','microcontroller']
    microcontroller = MicrocontrollerSerializer(many=True)


class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'gender']