// Methode zum Aufbauen einer Verbindung, falls das Netzwerk bekannt ist
bool tryToConnectToWifi(){

  // Adresse des Passworts im EEPROM
  int ssidPasswordAddress = 0;
  
  // Variable die den Verbindungsstatus speichert
  bool connected = false;

  // Variable die überprüft, wie lange der Verbindungsaufbau bereits versucht wurde
  int timeoutCounter;

  // Maximale Anzahl an 0,5ms-Intervallen die es dauern darf, sich zu verbinden
  int maxRetries = 30;

  // Daten zum log in im WLAN aus dem EEPROM lesen
  String ssid = readSSIDFromEEPROM(ssidPasswordAddress);
  String password = readPasswordFromEEPROM(ssidPasswordAddress);

  Serial.println(ssid);
  Serial.println(password);

  // Verbinden mit dem WLAN-Netzwerk
  Serial.println("Try to connect with WiFi: \nSSID: " + ssid + " \nPassword: " + password);
  delay(500);
  
  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.print("Connecting");
  timeoutCounter = 0;
  while ((WiFi.status() != WL_CONNECTED) && (timeoutCounter <= maxRetries)) {
    delay(500);
    Serial.print(".");
    timeoutCounter += 1;
    Serial.print(timeoutCounter);
  }

  // Überprüfen des Verbindungsaufbaus
  if (timeoutCounter <= maxRetries){
    connected = true;
    Serial.println();
    Serial.print("Connected, IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.print("Connection Failed");
  }
  
  Serial.println();
  Serial.println(connected);

  return connected;
}