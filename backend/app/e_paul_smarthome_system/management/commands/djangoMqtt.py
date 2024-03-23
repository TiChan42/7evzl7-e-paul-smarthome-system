from django.core.management.base import BaseCommand
import random
import time
import json
import requests

from ...model.account import Account
from ...model.microcontroller import Microcontroller
from ...model.port import Port

import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../.env"))

from rest_framework.response import Response

from paho.mqtt import client as mqtt_client

class PythonClientSub:
    def __init__(self):
        self.topics_to_subscribe = []
        self.broker = os.getenv("MQTT_BROKER")
        self.port = int(os.getenv("MQTT_PORT"))
        self.client_id = f'python-mqtt-{random.randint(0, 1000)}'
        self.username = os.getenv("MQTT_USER")
        self.password = os.getenv("MQTT_PASSWORD")
        print(self.broker, self.port, self.client_id, self.username, self.password)
        print("Client created")
        self.fetch_topics()
        self.client = self.connect_mqtt()
        self.client.loop_start()
        time.sleep(1)  # Warten Sie eine Sekunde, um der Verbindung Zeit zum Aufbau zu geben
    
    def fetch_topics(self):
        accounts = Account.objects.all()
        emails = []
        
        for account in accounts:
            emails.append(account.email) 
            
        print(emails)
        self.topics_to_subscribe = emails


    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                #print("Connected to MQTT Broker!")
                #client.subscribe(self.topic)
                pass
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, self.client_id)
        #client = mqtt_client.Client(client_id)
        client.username_pw_set(self.username, self.password)
        client.on_connect = on_connect
        client.connect(self.broker, self.port)
        return client


    def subscribe(self):
        def on_message(client, userdata, msg):
            #print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
            message = msg.payload.decode()
            data = json.loads(message)
            if data["type"] == 2:
                print(data)
                try:
                    password = data["key"]
                    id = data["microcontrollerId"]
                    currentStatus = data["state"]
                except KeyError:
                    return Response(status = 400)
                
                try:
                    microcontroller = Microcontroller.objects.get(pk = id)
                except Microcontroller.DoesNotExist:
                    return Response(status = 400)
                
                try:
                    port = Port.objects.get(microcontroller = microcontroller)
                except Port.DoesNotExist:
                    return Response(status = 400)
                
                #microcontrollerKey = microcontroller.key.encode("utf-8")
                
                try:
                    if password == microcontroller.key:
                        samePassword = 1
                    else:
                        samePassword = 0
                except ValueError:
                    return Response(status = 400)
                
                if samePassword == 0:
                    return Response(status = 400)
                else:
                    port.currentStatus = currentStatus
                    port.save()
                    return Response(status = 204)
                
                
        for topic in self.topics_to_subscribe:
            self.client.subscribe(topic)

        self.client.on_message = on_message

    def refresh_topics(self):
        self.fetch_topics()
        for topic in self.topics_to_subscribe:
            self.client.subscribe(topic)

        
    def run(self):
        self.client.loop_start()
        time.sleep(60)
        self.refresh_topics()
        self.run()

    #vermutlich unnötig, ggf löschen
    def add_topic(self, topic):
        self.topics_to_subscribe.append(topic)
        self.client.subscribe(topic)


    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

class Command(BaseCommand):
    help = 'Starts the MQTT client'

    def handle(self, *args, **options):
        testcl = PythonClientSub()
        testcl.subscribe()
        time.sleep(2)
        testcl.run()



        