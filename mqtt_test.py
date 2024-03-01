import paho.mqtt.client as mqtt


ip_address = "195.90.215.140"

topic = "robbe0503@t-online.de"

username = 5
password = "4GICNNUMQR2BFEPCIAIK"

message = "{type:1, target:5, command:\"changeRGBValue\", rgb:\"#0000FF\"}"
# Die Callback-Funktion wird aufgerufen, wenn der Broker eine Verbindung bestätigt hat.
def on_connect(client, userdata, flags, rc):
    print(f"Verbunden mit dem Ergebniscode {str(rc)}")

# Erstellen Sie eine MQTT-Client-Instanz
client = mqtt.Client()

# Definieren Sie die Callback-Funktionen
client.on_connect = on_connect

# Setzen Sie die Anmeldeinformationen für den Broker
client.username_pw_set(username, password)

# Verbinden Sie sich mit dem Broker
client.connect(ip_address, 1883)

# Veröffentlichen Sie eine Nachricht auf einem Topic
client.publish(topic, message)

# Blockieren Sie die Verarbeitung von Netzwerkpaketen
client.loop_forever()


# Warten Sie, um sicherzustellen, dass die Nachricht gesendet wurde
import time
time.sleep(1)

# Beenden Sie die Verarbeitung von Netzwerkpaketen
client.loop_stop()