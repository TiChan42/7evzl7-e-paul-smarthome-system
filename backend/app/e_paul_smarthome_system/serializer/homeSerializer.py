from ..model.user import User

from rest_framework import serializers

class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username']