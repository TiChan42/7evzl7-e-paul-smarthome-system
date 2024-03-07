
import random
import time
import json

from paho.mqtt import client as mqtt_client

class python_client:
    def __init__(self, topic):
        self.broker = '195.90.215.140'
        self.port = 1883
        self.topic = topic
        self.client_id = f'python-mqtt-{random.randint(0, 1000)}'
        self.username = "5"
        self.password = "4GICNNUMQR2BFEPCIAIK"
        print("Client created")
        self.client = self.connect_mqtt()
        self.client.loop_start()
        time.sleep(1)  # Warten Sie eine Sekunde, um der Verbindung Zeit zum Aufbau zu geben
    


    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, self.client_id)
        #client = mqtt_client.Client(client_id)
        client.username_pw_set(self.username, self.password)
        client.on_connect = on_connect
        client.connect(self.broker, self.port)
        return client

    def publish(self, target, command, brightness, rgb):
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
        result = self.client.publish(self.topic, messageJson)
        status = result[0]
        if status == 0:
            print(f"Send message to topic {self.topic}")
        else:
            print(f"Failed to send message to topic {self.topic}")

    def subscribe(self):
        def on_message(client, userdata, msg):
            print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
            message = msg.payload.decode()
            data = json.loads(message)
            if data["type"] == 2:
                print(message)


        self.client.subscribe(self.topic)
        self.client.on_message = on_message
        
    def run(self):
        self.client.loop_forever()


    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()


testcl = python_client("robbe0503@t-online.de")
testcl.subscribe()
testcl.publish(45, "on", 100, [255, 255, 255])
time.sleep(2)
testcl.run()

        