//TODO @Timo wir brauchen ein input für den controller namen
bool testLogIn(String user, String password){
  //diese Methode registriert den controller unter einem konto

  //hat die registrierung funktioniert?
  bool success = false;

  //aktuell noch ein default controller name, muss angepasst werden, damit das mitgegeben werden kann
  String controllerName = "TestName";

  //standartmäßig benötigen alle EEPROM Methoden einen startpunkt, dieser sollte immer null sein
  int eepromStart = 0;

  //die eindeutige ID des Conrollers, welche vom Server übergeben wird
  int controllerId;

  //Das zur ID passende Passwort, wird ebenfalls übergeben und vom Broker zur Authentifizierung benötigt
  const char* key = "";

  //checkt zuerst ob überhaupt eine Wlan verbindung existiert
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;  // Erstellt ein WiFiClient-Objekt

    HTTPClient http;

    
    if (http.begin(client, serverLoginApiUrl)) {
      http.addHeader("Content-Type", "application/json");
      
      
      // Die JSON-Daten die an den Server gesychickt werden
      String postData = "{\"email\":\""+ user +"\", \"password\":\""+ password +"\", \"name\":\""+ controllerName +"\"}";
      Serial.println(postData);

      // Sende den POST-Request und erfasse die Antwort
      int httpResponseCode = http.POST(postData);

      //interpretiert die antwort des Servers
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        
        String response = http.getString();
        Serial.println(response);
        if (httpResponseCode == 201){
          //wenn die funktion erfolgreich ist, soll sie true zurückgeben
          success = true;

          DynamicJsonDocument jsonDoc(1024);
          deserializeJson(jsonDoc, response);

          controllerId = jsonDoc["id"];
          key = jsonDoc["key"];

          //nur für debugging um zu prüfen ob die id und der key richtig übermittelt wurden
          /*
          Serial.print("id:");
          Serial.println(controllerId);
          Serial.print("key:");
          Serial.println(key);
          */

          //die mail adresse des Benutzers ist auch das Topic des controllers auf das er published und listend
          writeTopicToEEPROM(eepromStart, user);
          //nur für debugging um zu überprüfen ob das topic richtig im EEPROM liegt
          //Serial.println(readTopicFromEEPROM(eepromStart));

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

        }

        
      } else {
        //bei fehler im http request
        Serial.print("Error in HTTP POST request: ");
        Serial.println(httpResponseCode);
      }

      // Beende die Anfrage
      http.end();
  }

    delay(5000);  // Warte 5 Sekunden
  }
  return success;
}