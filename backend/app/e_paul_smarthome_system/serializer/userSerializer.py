from ..model.user import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['vorname','nachname','email','passwort','key','geschlecht','geburtsdatum']
        