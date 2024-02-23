from ..model.account import Account
from .userSerializer import  UserSerializer
from .microcontrollerSerializer import MicrocontrollerSerializer
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