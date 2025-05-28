#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "account_registration.h"
#include "eeprom_utils.h"

// External variables declared in client.ino
extern const char* serverLoginApiUrl;
extern String controllerMode;

// Methode , um den Client am Server zu registrieren
bool testLogIn(String user, String password){

  bool success = false;

  // Aktueller Modus des Controllers (lamp oder button)
  String controllerType = controllerMode;

  //aktuell noch ein default controller name, muss angepasst werden, damit das mitgegeben werden kann
  String controllerName = "Testname";

  //Startpunkt der EEPROM-Methoden
  int eepromStart = 0;

  // Eindeutige ID des Conrollers, welche vom Server übergeben wird
  int controllerId;

  // Das zur ID passende Passwort, wird ebenfalls übergeben und vom Broker zur Authentifizierung benötigt
  const char* key = "";

  // Checkt, ob eine WLAN-Verbindung existiert
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(serverLoginApiUrl);
    http.addHeader("Content-Type", "application/json");
      
    // JSON-Daten, die an den Server geschickt werden
    String postData = "{\"email\":\""+ user +"\", \"password\":\""+ password +"\", \"name\":\"" + controllerName + "\", \"type\":\""+ controllerType +"_1\"}";
    Serial.println(postData);

    // Senden der POST-Request and erfassen der Antwort
    int httpResponseCode = http.POST(postData);

    // Interpretieren der Serverantwort
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      String response = http.getString();
      Serial.println(response);
      if (httpResponseCode == 201){
        success = true;

        DynamicJsonDocument jsonDoc(1024);
        deserializeJson(jsonDoc, response);

        controllerId = jsonDoc["id"];
        key = jsonDoc["key"];

        //nur für debugging um zu prüfen ob die id und der key richtig übermittelt wurden

        Serial.print("id:");
        Serial.println(controllerId);
        Serial.print("key:");
        Serial.println(key);


        //die mail adresse des Benutzers ist auch das Topic des controllers auf das er published und listend
        writeTopicToEEPROM(eepromStart, user);

        //die ID des kontrollers muss zum authentifizieren gespeichert werden
        writeIDToEEPROM(eepromStart, String(controllerId));
        //nur für debugging um zu überprüfen ob die ID richtig im EEPROM liegt
        Serial.println(readIDFromEEPROM(eepromStart));

        //das Passwort des kontrollers muss zum authentifizieren gespeichert werden
        writeKeyToEEPROM(eepromStart, key);
        //nur für debugging um zu überprüfen ob das passwort richtig im EEPROM liegt
        Serial.println(readKeyFromEEPROM(eepromStart));

        writeModeToEEPROM(eepromStart, controllerMode);
        //nur für debugging um zu überprüfen ob der Mode richtig im EEPROM liegt
        Serial.println(readModeFromEEPROM(eepromStart));

        ESP.restart();       
      }
    } else {
      //bei fehler im http request
      Serial.print("Error in HTTP POST request: ");
      Serial.println(httpResponseCode);
    }
    // Beende die Anfrage
    http.end();
    
    delay(5000);  // Warte 5 Sekunden
  }
  return success;
}