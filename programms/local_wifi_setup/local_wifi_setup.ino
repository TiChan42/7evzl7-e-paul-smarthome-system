#include <ESP8266WiFi.h>

const char* ssid = "MeinEigenesWLAN";
const char* password = "MeinPasswort";

void setup() {
  Serial.begin(115200);

  // Verbindung zum WLAN-Netzwerk aufbauen
  WiFi.softAP(ssid, password);

  Serial.println("WLAN-Netzwerk aufgesetzt. IP-Adresse:");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  // Hier können weitere Anweisungen für den Programmablauf hinzugefügt werden.
}
