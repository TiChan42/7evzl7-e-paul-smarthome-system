from ..model.account import Account
from .userSerializer import  UserSerializer
from rest_framework import serializers

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['name', 'description', 'user']
    
    user = UserSerializer(many=True)