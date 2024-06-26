#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ownSSID = "E_Paul_Module_WiFi";
const char* ownSSIDpassword = "";

// Variablen für die Anmeldung im Heimnetz
char* loginSSID;
char* loginSSIDpassword;

// Api für die Registrierung des Controllers auf den Account
const char* serverLoginApiUrl = "http://www.epaul-smarthome.de:8000/api/signUp/microcontroller"; 

// Link zum MQTT-Broker
const char* mqtt_server = "195.90.215.140";

String mqttUsr=""; //esp8266
String mqttPw=""; //testpw123

// Das Topic auf welches der Controller published, auch die Mail des Benutzers
String topic="";

// Der Startpunkt des EEPROM, sollte auf 0 gehalten werden
int eepromStart = 0;

unsigned long ulReqcount;
unsigned long timeOutMillis;

// Variablen für die Module
String controllerMode = "lamp"; // lamp oder button

// Vorbereitungen für das Button-Modul
// Standartmäßiges setzen der Flags (Standart-Modus: Schalter)
bool state = 0; //back
bool testState = 1; //back
bool mode = 0; //back
bool showStateOnLED = 1; //back

#define ONBOARD_LED 2          
#define BUTTON      0

// Vorbereitungen für das LED Modul
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
char global_red=0,global_green=0,global_blue=0,global_brightness=100; //back
bool white_flag = true; //back

// Erstelle eine Instanz des Servers auf Port 80
WiFiServer server(80);
ESP8266WebServer webServer(50000);

// Erstellen der Clients für WLAN und MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Definieren von Variablen für MQTT
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(200)
char msg[MSG_BUFFER_SIZE];

void clearEEPROM();

void setup() { 
  // Initialisiere globale Variablen
  ulReqcount = 0;
  timeOutMillis = 500;

  // Starte die serielle Kommunikation
  Serial.begin(9600);

  // Auslesen und handling der Reset-Variable im EEPROM
  char rst = readResetCounterFromEEPROM();
  Serial.print("Reset Counter: ");
  Serial.print(rst);
  Serial.print("\n");
  if (rst == '0') {
    rst = '1';
    writeResetCounterToEEPROM((String)rst);
  } else if (rst == '1') {
    rst = '2';
    writeResetCounterToEEPROM((String)rst);
  } else { //if (rst == '2') {
    Serial.println("Clearen");
    clearEEPROM();
    writeResetCounterToEEPROM("0");
    ESP.reset();
  }
  Serial.println(readResetCounterFromEEPROM());

  delay(1000);
  writeResetCounterToEEPROM("0");
  Serial.println(readResetCounterFromEEPROM());

  readAll();

  delay(1);

  // Zum debuggen der Loginpage bei bestehender Netzwerkverbindung auf true setzen
  bool debugLoginPageOnce = false;

  // Zur Kontrolle des freien Speichers
  delay(5000);
  Serial.print("Freier Speicher: ");
  Serial.println(ESP.getFreeHeap());

  bool connected = false;
  if(debugLoginPageOnce == false){
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

  // Initialisieren der Variablen für die Module
  controllerMode = readModeFromEEPROM(eepromStart);

  // Button modul
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

}