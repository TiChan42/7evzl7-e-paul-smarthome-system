from ..model.account import Account
from ..model.user import User

from .userSerializer import UserLoginSerializer

from rest_framework import serializers

class LoginAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id']

    
class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']