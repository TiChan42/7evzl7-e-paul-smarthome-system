from ..model.log import Log

from rest_framework import serializers

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['id','date','remoteAddress','status','method','endpoint']
