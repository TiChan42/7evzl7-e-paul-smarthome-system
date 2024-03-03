from ..model.port import Pin
from rest_framework import serializers

class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = ["art","microcrontroller","inUse"]