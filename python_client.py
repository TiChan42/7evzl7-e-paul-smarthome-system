
import random
import time

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

    def publish(self, message):
        result = self.client.publish(self.topic, message)
        status = result[0]
        if status == 0:
            print(f"Send message to topic {self.topic}")
        else:
            print(f"Failed to send message to topic {self.topic}")


    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()


testcl = python_client("robbe0503@t-online.de")
        