from ..model.user import User
from rest_framework import serializers
from .microcontrollerSerializer import MicrocontrollerSerializer
from .logSerializer import LogSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','gender','birthdate']
  
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','gender','birthdate', 'rights']


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'gender']

class UserHomeSerializer(serializers.ModelSerializer):
    userImageName = serializers.SerializerMethodField("getUserImageName")
    class Meta:
        model = User
        fields = ['id','username', 'userImageName']
        #fields = ['username', 'pictureid', 'log']
        
    def getUserImageName(self, obj):
        return obj.imageName
    #log = LogSerializer(many=True)
    # In doku nachschauen wie das genau geht

class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'gender']
