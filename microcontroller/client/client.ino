#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp32-hal-ledc.h>

// Project headers
#include "mqtt_utils.h"
#include "network_utils.h"
#include "eeprom_utils.h"
#include "button_module.h"
#include "lamp_module.h"
#include "esp32_pwm.h"
#include "first_connection.h"
#include "account_registration.h"
#include "hexagonz_module.h"

// Constants and configuration variables
const char* ownSSID = "E_Paul_Module_WiFi";
const char* ownSSIDpassword = "";

// Variables for home network login
char* loginSSID;
char* loginSSIDpassword;

// API for controller registration
const char* serverLoginApiUrl = "http://www.epaul-smarthome.de:8000/api/signUp/microcontroller"; 

// MQTT broker link
const char* mqtt_server = "195.90.215.140";

String mqttUsr = ""; // esp8266
String mqttPw = ""; // testpw123

// Topic for controller publishing (also user email)
String topic = "";

// EEPROM starting point (should be kept at 0)
int eepromStart = 0;

unsigned long ulReqcount;
unsigned long timeOutMillis;

// Module variables
String controllerMode = "hexagonz_lamp"; // lamp or hexagonz or button

// Button module preparation (default mode: switch)
bool state = 0; // back
bool testState = 1; // back
bool mode = 0; // back
bool showStateOnLED = 1; // back

#define ONBOARD_LED 23          
#define BUTTON      22

// LED module preparation
// Initialize LED pins
uint8_t LED_RED = 4;
uint8_t LED_GREEN = 5;
uint8_t LED_BLUE = 18;
uint8_t LED_WHITE = 21;

// Define color constants
#define COLOR_RED 255,0,0
#define COLOR_GREEN 0,255,0
#define COLOR_BLUE 0,0,255
#define COLOR_VIOLET 255,0,255
#define COLOR_YELLOW 255,255,0
#define COLOR_CYAN 0,255,255

// Global variables for current color and brightness
char global_red = 0, global_green = 0, global_blue = 0, global_brightness = 100; // back
bool white_flag = true; // back

// Server instance on port 80
WiFiServer server(80);
WebServer webServer(50000);

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// MQTT variables
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (200)
char msg[MSG_BUFFER_SIZE];

// MQTT callback function
void callback(char* topic, byte* payload, unsigned int length) {
  bool executed = false;

  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String jsonSignal = "";
  for (int i = 0; i < length; i++) {
    jsonSignal += (char)payload[i];
  }
  Serial.println(jsonSignal);
  Serial.println();
  executed = mqttJsonInterpretation(jsonSignal);
}

void setup() { 
  if (controllerMode == "hexagonz_lamp") {
    initHexagonzModule();
    setInfoLedOn(); // Turn on info LED at startup
  }


  // Initialize global variables
  ulReqcount = 0;
  timeOutMillis = 500;

  // Start serial communication
  Serial.begin(9600);

  // Read and handle EEPROM reset variable
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
  } else { // if (rst == '2')
    Serial.println("Clearen");
    clearEEPROM();
    writeResetCounterToEEPROM("0");
    ESP.restart();
  }
  Serial.println(readResetCounterFromEEPROM());

  delay(1000);
  writeResetCounterToEEPROM("0");
  Serial.println(readResetCounterFromEEPROM());

  readAll();

  delay(1);

  // For debugging the login page with existing network connection
  bool debugLoginPageOnce = false;

  // Check free memory
  delay(5000);
  Serial.print("Freier Speicher: ");
  Serial.println(ESP.getFreeHeap());

  bool connected = false;
  if (!debugLoginPageOnce) {
    // Check if SSID in EEPROM can be used
    connected = tryToConnectToWifi();
    if (connected) {
      int startEEPROM = 0;
      delay(10000);
      Serial.println(readIDFromEEPROM(startEEPROM));
      Serial.println(readKeyFromEEPROM(startEEPROM));
    }
  }

  
  // Check if connection has been established
  if (!connected) {
    // If no connection, set up own WiFi
    initAccessPoint();
    // Start loop to get internet connection data
    tryToSetupViaWebserver();
  }
  if(controllerMode == "hexagonz_lamp") {
    setInfoLedOff();
  }

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  // For testing, delete later
  writeModeToEEPROM(eepromStart, controllerMode);
  // For debugging to check if mode is correctly in EEPROM
  Serial.println(readModeFromEEPROM(eepromStart));

  // Initialize module variables
  controllerMode = readModeFromEEPROM(eepromStart);
  setupPWM();

  // Button module
  if (controllerMode == "button") {
    pinMode(ONBOARD_LED, OUTPUT);
    pinMode(BUTTON, INPUT);  
    digitalWrite(ONBOARD_LED, HIGH);
  } else if (controllerMode == "lamp") {
    // Initialize digital pins as LED outputs
    pinMode(LED_RED, OUTPUT);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_BLUE, OUTPUT);
    pinMode(LED_WHITE, OUTPUT);

    // Turn off all LEDs
    digitalWrite(LED_RED, HIGH);  
    digitalWrite(LED_GREEN, HIGH);  
    digitalWrite(LED_BLUE, HIGH);  
    digitalWrite(LED_WHITE, HIGH); 
  } else if (controllerMode == "hexagonz_lamp") {
    initHexagonzModule();
  }

  // Print controller identification info
  Serial.println("Controller Information:");
  Serial.print("ID: ");
  Serial.println(readIDFromEEPROM(eepromStart));
  Serial.print("Mode: ");
  Serial.println(readModeFromEEPROM(eepromStart));
  Serial.print("Topic: ");
  Serial.println(readTopicFromEEPROM(eepromStart));
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Check current controller mode
  controllerMode = readModeFromEEPROM(eepromStart);
  
  // If in button mode, constantly check button
  if (controllerMode == "button") {
    checkButton();
  } else if (controllerMode == "hexagonz_lamp") {
    // Check hexagonz button and handle blinking
    checkHexagonzButton();
  }
}