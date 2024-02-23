//versucht eine Verbindung mit dem Netzwerk aufzubauen, falls das Netzwerk bekannt ist
bool tryToConnectToWifi(){

  //die Adresse des Passworts im EEPROM
  int ssidPasswordAddress = 0;
  
  //Variable die speichert ob eine Verbindung aufgebaut ist
  bool connected = false;

  //Variable die überprüft wie lange die Verbindung bereits versucht wurde
  int timeoutCounter;

  //maximale Zeit in 0,5 ms die es dauern darf sich zu verbinden
  int maxRetries = 30;

  //Daten zum log in im wlan aus dem EEPROM
  String ssid = readSSIDFromEEPROM(ssidPasswordAddress);
  String password = readPasswordFromEEPROM(ssidPasswordAddress);

  Serial.println(ssid);
  Serial.println(password);

  //versuche eine Verbindung mit dem Wlan aufzubauen
  Serial.println("Try to connect with WiFi: SSID: " + ssid + " Password: " + password);

  delay(500);
  
  //versuche mit Netzwerk zu verbinden
  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  
    while ((WiFi.status() != WL_CONNECTED) && (timeoutCounter <= maxRetries))
    {
      delay(500);
      Serial.print(".");
      
      timeoutCounter += 1;
      Serial.print(timeoutCounter);
      
    }

  //überprüfen ob verbindung erfolgreich war
  if (timeoutCounter <= maxRetries){

    connected = true;

    Serial.println();
    Serial.print("Connected, IP address: ");
    Serial.println(WiFi.localIP());
  }
  
  Serial.println();
  Serial.println(connected);

  //zurückgeben ob verbunden
  Serial.print("bool Connected: ");
  Serial.println(connected);
  return connected;

}