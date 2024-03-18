from ..model.user import User
from rest_framework import serializers
from .microcontrollerSerializer import MicrocontrollerSerializer
from .logSerializer import LogSerializer
from .groupSerializer import GroupSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','gender','birthdate', 'role']
  
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
        fields = ['id','username', 'userImageName', 'role']
        
    def getUserImageName(self, obj):
        return obj.imageName


class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'gender']

class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['group']  
    
    group = GroupSerializer(many = True)