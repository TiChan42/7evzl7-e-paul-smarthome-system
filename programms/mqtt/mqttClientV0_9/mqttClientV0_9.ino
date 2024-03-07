#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ownSSID = "E_Paul_Module_WiFi";
const char* ownSSIDpassword = "";

// für Anmeldung im Heimnetz
char* loginSSID;
char* loginSSIDpassword;

//api auf den server für die registrierung des controllers auf den account
const char* serverLoginApiUrl = "http://www.epaul-smarthome.de:8000/api/signUp/microcontroller"; 

//link auf den mqtt broker
const char* mqtt_server = "195.90.215.140";

String mqttUsr=""; //esp8266
String mqttPw=""; //testpw123

//das topic auf das der controller published, auch die mail des benutzers
String topic="";

//der Startpunkt des EEPROM, sollte auf 0 gehalten werden
int eepromStart = 0;

unsigned long ulReqcount;
unsigned long timeOutMillis;

//variablen für die module
String controllerMode = "lamp";

//alles bereit machen für das button modul
//Standartmäßiges setzen der Flags (Standart-Modus: Schalter)
bool state = 0;
bool testState = 1;
bool mode = 0;
bool showStateOnLED = 1;

#define ONBOARD_LED 2          
#define BUTTON      0

//alles bereit machen für das LED Modul
// Initialisiere Pins für LEDs
#define LED_RED   4
#define LED_GREEN 5
#define LED_BLUE  0
#define LED_WHITE 2

// Definiere Farbkonstanten
#define COLOR_RED 255,0,0
#define COLOR_GREEN 0,255,0
#define COLOR_BLUE 0,0,255
#define COLOR_VIOLET 255,0,255
#define COLOR_YELLOW 255,255,0
#define COLOR_CYAN 0,255,255

// Globale Variablen für aktuelle Farbinformationen und Helligkeit
char global_red=0,global_green=0,global_blue=0,global_brightness=100;
bool white_flag = true;


// Erstelle eine Instanz des Servers auf Port 80
WiFiServer server(80);
ESP8266WebServer webServer(50000);

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(100)
char msg[MSG_BUFFER_SIZE];

void clearEEPROM();

void setup() 
{ 
  // Initialisiere globale Variablen
  ulReqcount = 0;
  timeOutMillis = 500;

  // Starte die serielle Kommunikation
  Serial.begin(115200);
  delay(1);
  // kann geändert werden um die seite trotz verfügbarem Netzwerk anzuzeigen
  bool debugLoginPage = false;

  
  bool connected = false;
  if(debugLoginPage == false){
    //überprüft ob die SSID im EEPROM verwendet werden kann
    connected = tryToConnectToWifi();
    if(connected == true){
      int startEEPROM = 0;
      delay(10000);
      Serial.println(readIDFromEEPROM(startEEPROM));
      Serial.println(readKeyFromEEPROM(startEEPROM));
    }
  }
  
  // Überprüfe, ob bereits eine Verbindung hergestellt wurde
  if(connected == false){
    // Falls keine Verbindung hergestellt werden kann, richte ein eigenes WLAN ein
    setUpWiFiAccessPoint();
    // Starte eine Schleife, die versucht, die Daten für die Internetverbindung zu erhalten
    tryToSetupViaWebserver();
  }

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  //nur für testen, später wieder löschen
  writeModeToEEPROM(eepromStart, controllerMode);
  //nur für debugging um zu überprüfen ob der Mode richtig im EEPROM liegt
  Serial.println(readModeFromEEPROM(eepromStart));

  //initialisieren der Variablen für die module
  controllerMode = readModeFromEEPROM(eepromStart);

  //button modul
  if(controllerMode == "button"){
    pinMode(ONBOARD_LED, OUTPUT);
    pinMode(BUTTON, INPUT);  
    digitalWrite(ONBOARD_LED, HIGH);
  } else if (controllerMode == "lamp"){
    // Initialisiere digitale Pins als Ausgänge für LEDs
    pinMode(LED_RED, OUTPUT);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_BLUE, OUTPUT);
    pinMode(LED_WHITE, OUTPUT);

    // Schalte alle LEDs aus
    digitalWrite(LED_RED, HIGH);  
    digitalWrite(LED_GREEN, HIGH);  
    digitalWrite(LED_BLUE, HIGH);  
    digitalWrite(LED_WHITE, HIGH); 
  }




}

bool mqttJsonInterpretation(String mqttJsonSignal);

//löschen nach testen:
void mqttChangeBrightness();

//löschen nach testen:
void mqttChangeColor();


void callback(char* topic, byte* payload, unsigned int length) {
  bool executed = false;

  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String jsonSignal = "";
  for (int i = 0; i < length; i++) {
    //Serial.print((char)payload[i]);
    jsonSignal += (char)payload[i];
  }
  Serial.println(jsonSignal);
  Serial.println();
  if(mqttJsonInterpretation(jsonSignal) == true){
    executed = true;
  }
  
}

void reconnect() {
  // Loop bis wir verbunden sind
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    // erstelle eine zufällige Client ID, da diese nicht relevant ist für den Broker
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Credentials um sich beim Broker anzumelden, welche im EEPROM liegen sollten
    mqttUsr = readIDFromEEPROM(eepromStart);
    mqttPw = readKeyFromEEPROM(eepromStart);

    Serial.print("ID: ");
    Serial.println(mqttUsr.c_str());
    Serial.print("key: ");
    Serial.println(mqttPw.c_str());

    topic = readTopicFromEEPROM(eepromStart);

    //muss noch angepasst werden
    if (client.connect(clientId.c_str(), mqttUsr.c_str(), mqttPw.c_str() )) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish(topic.c_str(), "hi");
      // ... and resubscribe
      client.subscribe(topic.c_str());
    } else {
      //gibt den Statuscode aus, falls die Verbindung fehlschlägt
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // warte 5 sekunden befor es erneut versucht wird
      delay(5000);
    }
  }
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  //überprüft in welchem Modus sich der Controller befindet
  controllerMode = readModeFromEEPROM(eepromStart);
  //falls der controller im modus button ist, soll er ständig überprüfen ob der Button gedrückt wird
  if(controllerMode == "button"){
    checkButton();
  }

  //mqttChangeBrightness();
  mqttChangeColor();
  delay(10000);

  //zum Testen und debuggen vorerst dalassen
  /*
  topic = readTopicFromEEPROM(eepromStart);
  
  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    snprintf (msg, MSG_BUFFER_SIZE, "{type:1, target:4, command:\"lampOn\"}");
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish(topic.c_str(), msg);
  }
  */
}