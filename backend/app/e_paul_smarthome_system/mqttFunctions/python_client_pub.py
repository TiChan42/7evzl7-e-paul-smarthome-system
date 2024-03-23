
import random
import time
import json

from paho.mqtt import client as mqtt_client

import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

class PythonClientPub:
    def __init__(self):
        self.topics_to_subscribe = []
        self.broker = os.getenv("MQTT_BROKER")
        self.port = int(os.getenv("MQTT_PORT"))
        self.client_id = f'python-mqtt-{random.randint(0, 1000)}'
        self.username = os.getenv("MQTT_USER")
        self.password = os.getenv("MQTT_PASSWORD")
        print("Client created")
        self.client = self.connect_mqtt()
        self.client.loop_start()
        time.sleep(1)  # Warten Sie eine Sekunde, um der Verbindung Zeit zum Aufbau zu geben


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

    def publish_command(self,pubTopic, target, command, brightness = None, rgb = None):
        if "#" in str(brightness):
            rgb = brightness
            brightness = None

        message = {
            "type": 1,
            "target": target,
            "command": command
        }
        
        if brightness:
            message["brightness"] = brightness
        if rgb:
            message["rgb"] = rgb
        messageJson = json.dumps(message)
        result = self.client.publish(pubTopic, messageJson)
        status = result[0]
        if status == 0:
            print(f"Send message to topic {pubTopic}")
        else:
            print(f"Failed to send message to topic {pubTopic}")


    def publishScene(self, pubTopic, message):
        result = self.client.publish(pubTopic, message)
        status = result[0]
        
        if status == 0:
            print(f"Send message to topic {pubTopic}")
        else:
            print(f"Failed to send message to topic {pubTopic}")


    def __del__(self):
        self.client.loop_stop()
        self.client.disconnect()
        print("Client disconnected")


#tests

#testcl = python_client_pub()

#testcl.publish_command("robbe0503@t-online.de", 7, "switchOff")

#testcl.publish_command("robbe0503@t-online.de", 7, "switchOn")
#testcl.publish_command("robbe0503@t-online.de", 7, "changeLampBrightness", 200)
#time.sleep(2)


        