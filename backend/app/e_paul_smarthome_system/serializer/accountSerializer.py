from ..model.account import Account
from .userSerializer import  UserSerializer
from rest_framework import serializers

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['email', 'firstname','lastname','description', 'user']
    
    user = UserSerializer(many=True)