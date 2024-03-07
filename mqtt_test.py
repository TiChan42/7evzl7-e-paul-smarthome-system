from paho.mqtt import client as mqtt_client

broker = '195.90.215.140'
port = 1883
topic = "robbe0503@t-online.de"
client_id = f'python-mqtt-{random.randint(0, 1000)}'
username = 5
password = "4GICNNUMQR2BFEPCIAIK"


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)
    # Set Connecting Client ID
    client = mqtt_client.Client(client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.connect(broker, port)
    return client


    FIRST_RECONNECT_DELAY = 1
RECONNECT_RATE = 2
MAX_RECONNECT_COUNT = 12
MAX_RECONNECT_DELAY = 60

def on_disconnect(client, userdata, rc):
    logging.info("Disconnected with result code: %s", rc)
    reconnect_count, reconnect_delay = 0, FIRST_RECONNECT_DELAY
    while reconnect_count < MAX_RECONNECT_COUNT:
        logging.info("Reconnecting in %d seconds...", reconnect_delay)
        time.sleep(reconnect_delay)

        try:
            client.reconnect()
            logging.info("Reconnected successfully!")
            return
        except Exception as err:
            logging.error("%s. Reconnect failed. Retrying...", err)

        reconnect_delay *= RECONNECT_RATE
        reconnect_delay = min(reconnect_delay, MAX_RECONNECT_DELAY)
        reconnect_count += 1
    logging.info("Reconnect failed after %s attempts. Exiting...", reconnect_count)

def publish(client):
    msg_count = 1
    while True:
        time.sleep(1)
        msg = f"messages: {msg_count}"
        result = client.publish(topic, msg)
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
        msg_count += 1
        if msg_count > 5:
            break






#import paho.mqtt.client as mqtt
#
#
#ip_address = "195.90.215.140"
#
#topic = "robbe0503@t-online.de"
#
#username = 5
#password = "4GICNNUMQR2BFEPCIAIK"
#
#message = "{type:1, target:5, command:\"changeRGBValue\", rgb:\"#0000FF\"}"
## Die Callback-Funktion wird aufgerufen, wenn der Broker eine Verbindung bestätigt hat.
#def on_connect(client, userdata, flags, rc):
#    print(f"Verbunden mit dem Ergebniscode {str(rc)}")
#
## Erstellen Sie eine MQTT-Client-Instanz
#client = mqtt.Client()
#
## Definieren Sie die Callback-Funktionen
#client.on_connect = on_connect
#
## Setzen Sie die Anmeldeinformationen für den Broker
#client.username_pw_set(username, password)
#
## Verbinden Sie sich mit dem Broker
#client.connect(ip_address, 1883)
#
## Veröffentlichen Sie eine Nachricht auf einem Topic
#client.publish(topic, message)
#
## Blockieren Sie die Verarbeitung von Netzwerkpaketen
#client.loop_forever()
#
#
## Warten Sie, um sicherzustellen, dass die Nachricht gesendet wurde
#import time
#time.sleep(1)
#
## Beenden Sie die Verarbeitung von Netzwerkpaketen
#client.loop_stop()