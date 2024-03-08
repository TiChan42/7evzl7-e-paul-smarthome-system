from ..model.account import Account
from .userSerializer import  UserSerializer, UserHomeSerializer
from .microcontrollerSerializer import MicrocontrollerSerializer, MicrocontrollerPortSerializer
from rest_framework import serializers

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['email','description', 'user']
    
    user = UserSerializer(many=True)

class AccountMicrocontrollerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['microcontroller']

    microcontroller = MicrocontrollerSerializer(many = True)
    
class AccountUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['user']

    user = UserHomeSerializer(many = True)
    
class AccountPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['microcontroller']
    
    microcontroller = MicrocontrollerPortSerializer(many = True)    