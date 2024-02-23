#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <PubSubClient.h>

const char* ownSSID = "E_Paul_Module_WiFi";
const char* ownSSIDpassword = "";

// für Anmeldung im Heimnetz
char* loginSSID;
char* loginSSIDpassword;

//link auf den mqtt broker
const char* mqtt_server = "195.90.215.140";
const char* mqttUsr="esp8266";
const char* mqttPw="testpw123";


unsigned long ulReqcount;
unsigned long timeOutMillis;


// Erstelle eine Instanz des Servers auf Port 80
WiFiServer server(80);
ESP8266WebServer webServer(50000);

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

void setup() 
{

  pinMode(BUILTIN_LED, OUTPUT); 
  // Initialisiere globale Variablen
  ulReqcount = 0;
  timeOutMillis = 500;

  // Starte die serielle Kommunikation
  Serial.begin(115200);
  delay(1);
  // kann geändert werden um die seite trotz verfügbarem Netzwerk anzuzeigen
  bool debugLoginPage = false;

  //überprüft ob die SSID im EEPROM verwendet werden kann
  bool connected = tryToConnectToWifi();
  // Überprüfe, ob bereits eine Verbindung hergestellt wurde
  if((connected == false) && (debugLoginPage == false)){
    // Falls keine Verbindung hergestellt werden kann, richte ein eigenes WLAN ein
    setUpWiFiAccessPoint();
    // Starte eine Schleife, die versucht, die Daten für die Internetverbindung zu erhalten
    tryToSetupViaWebserver();
  }

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}



void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    digitalWrite(BUILTIN_LED, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else {
    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqttUsr, mqttPw)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "hello world");
      // ... and resubscribe
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    snprintf (msg, MSG_BUFFER_SIZE, "hello world #%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("outTopic", msg);
  }
}