from ..model.command import Command

from ..serializer.commandOptionSerializer import CommandOptionSerializer

from rest_framework import serializers

class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Command
        fields = ['description','commandOption']
    
    commandOption = CommandOptionSerializer(many = True)