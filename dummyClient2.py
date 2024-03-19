
import random
import time
import json

from paho.mqtt import client as mqtt_client

class python_client:
    def __init__(self):
        self.topics_to_subscribe = []
        self.broker = '195.90.215.140'
        self.port = 1883
        self.client_id = f'python-mqtt-{random.randint(0, 1000)}'
        self.username = "7"
        self.password = "WH7OV80P5OSZZASJIL4V"
        print("Client created")
        self.client = self.connect_mqtt()
        self.client.loop_start()
        time.sleep(1)  # Warten Sie eine Sekunde, um der Verbindung Zeit zum Aufbau zu geben
    
    def fetch_topics(self):
        #hier dann den part aus der notes.txt integrieren
        self.topics_to_subscribe = ["robbe0503@t-online.de","testmail"]

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

    def publish(self,pubTopic, target, command, brightness = None, rgb = None):
        if "#" in str(brightness):
            rgb = brightness
            brightness = None

        message = {
            "type": 2,
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

    def subscribe(self):
        def on_message(client, userdata, msg):
            #print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
            message = msg.payload.decode()
            data = json.loads(message)
            if data["type"] == 2:
                print(message)

        for topic in self.topics_to_subscribe:
            self.client.subscribe(topic)

        self.client.on_message = on_message

    def refresh_topics(self):
        self.fetch_topics()
        for topic in self.topics_to_subscribe:
            self.client.subscribe(topic)

        
    def run(self):
        self.client.loop()
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


testcl = python_client()
#testcl.add_topic("robbe0503@t-online.de")
while True:
    testcl.publish("testmail", "Hello", "World")	
    time.sleep(10)


        