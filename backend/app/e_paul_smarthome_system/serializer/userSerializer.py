from ..model.user import User
from rest_framework import serializers
from .microcontrollerSerializer import MicrocontrollerSerializer
from .logSerializer import LogSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','key','gender','birthdate']
  
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','key','gender','birthdate','microcontroller', 'rights']
    microcontroller = MicrocontrollerSerializer(many=True)

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class UserHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'pictureid']
        #fields = ['username', 'pictureid', 'log']
    #log = LogSerializer(many=True)
    # In doku nachschauen wie das genau geht



class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'gender']

class UserHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'pictureid']
        #fields = ['username', 'pictureid', 'log']
    #log = LogSerializer(many=True)
    # In doku nachschauen wie das genau geht

class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'gender']
