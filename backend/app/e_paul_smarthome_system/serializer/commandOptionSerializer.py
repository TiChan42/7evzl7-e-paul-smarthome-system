from ..model.commandOption import CommandOption

from rest_framework import serializers

class CommandOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandOption
        fields = ['key', 'static', 'value']