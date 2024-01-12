#include <ESP8266WiFi.h>

void setup() {

  Serial.begin(115200);

  // WiFi-Modul initialisieren
  WiFi.mode(WIFI_STA);

  Serial.println("Scanne verfügbare WLAN-Netzwerke...");

  // Netzwerke scannen und SSID-Array erstellen
  int networkCount = WiFi.scanNetworks();
  int SSIDs[networkCount];

  if (networkCount == 0) {

    Serial.println("Keine WLAN-Netzwerke gefunden.");
  
  } else {

    Serial.print(networkCount);
    Serial.println(" WLAN-Netzwerke gefunden:");

    for (int i = 0; i < networkCount; ++i) {

      SSIDs[i] = WiFi.SSID(i);

      Serial.print(i+1);
      Serial.print(": ");
      Serial.println(SSIDs[i]);
    
    }
  }
}

void loop() {
  // Hier können weitere Anweisungen für den Programmablauf hinzugefügt werden.
}
