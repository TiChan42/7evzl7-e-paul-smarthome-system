#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

const char* ownSSID = "E_Paul_Module_WiFi";
const char* ownSSIDpassword = "";

// für Anmeldung im Heimnetz
char* loginSSID;
char* loginSSIDpassword;

unsigned long ulReqcount;
unsigned long timeOutMillis;

const char* serverUrl = "http://www.testingmcafeesites.com/testrep_yellow.html"; 

// Erstelle eine Instanz des Servers auf Port 80
WiFiServer server(80);
ESP8266WebServer webServer(50000);

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

  //überprüft ob die SSID im EEPROM verwendet werden kann
  bool connected = tryToConnectToWifi();
  // Überprüfe, ob bereits eine Verbindung hergestellt wurde
  if((connected == false) && (debugLoginPage == false)){
    // Falls keine Verbindung hergestellt werden kann, richte ein eigenes WLAN ein
    setUpWiFiAccessPoint();
    // Starte eine Schleife, die versucht, die Daten für die Internetverbindung zu erhalten
    tryToSetupViaWebserver();
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;  // Create a WiFiClient object

    HTTPClient http;

    // Use ::begin(client, url) instead of ::begin(url)
    if (http.begin(client, serverUrl)) {

      // Send a GET request
      int httpCode = http.GET();

      if (httpCode > 0) {
        // If a valid HTTP response is received
        String payload = http.getString();
        Serial.println(httpCode);
        Serial.println(payload);
      } else {
        Serial.println("Error on HTTP request");
      }

      http.end();  // Close connection
    } else {
      Serial.println("Unable to connect to the server");
    }

    delay(5000);  // Wait for 5 seconds before making the next request
  }
}