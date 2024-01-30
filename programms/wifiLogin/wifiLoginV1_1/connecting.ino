//versucht eine Verbindung mit dem Netzwerk aufzubauen, falls das Netzwerk bekannt ist
bool tryToConnectToWifi(){

  int ssidAddress = 600;
  int passwordAddress = 700;

  bool connected = false;
  int timeoutCounter = 0;

  int maxRetries = 30;

  String ssid = readStringFromEEPROM(ssidAddress);
  String password = readStringFromEEPROM(passwordAddress);

  Serial.println(ssid);
  Serial.println(password);

  //versuche eine Verbindung mit dem Wlan aufzubauen
  Serial.println("Try to connect with WiFi: SSID: " + ssid + " Password: " + password);

  delay(500);
  
  
  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  
    while ((WiFi.status() != WL_CONNECTED) && (timeoutCounter <= maxRetries))
    {
      delay(500);
      Serial.print(".");
      
      timeoutCounter += 1;
      Serial.print(timeoutCounter);
      
    }

  if (timeoutCounter <= maxRetries){

    connected = true;

    Serial.println();
    Serial.print("Connected, IP address: ");
    Serial.println(WiFi.localIP());
  }
  
  Serial.println();
  Serial.println(connected);

  return connected;

}