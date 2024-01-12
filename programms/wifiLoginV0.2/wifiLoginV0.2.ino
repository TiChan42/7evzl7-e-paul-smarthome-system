#include <ESP8266WiFi.h>

const char* ssid = "MeinEigenesWLAN";
const char* password = "MeinPasswort";

WiFiServer server(80);

void setup() {
  Serial.begin(115200);

  // Verbindung zum WLAN-Netzwerk aufbauen
  WiFi.softAP(ssid, password);

  Serial.println("WLAN-Netzwerk aufgesetzt. IP-Adresse:");
  Serial.println(WiFi.softAPIP());

  // Start des Servers
  server.begin();
  Serial.println("Server gestartet");

  // WiFi-Modul initialisieren für WLAN-Scan
  //WiFi.mode(WIFI_STA);
}

void loop() {
  // Prüfen, ob sich ein Client verbunden hat
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Warten auf Daten vom Client
  Serial.println("new client");
  while (!client.available()) {
    delay(1);
  }

  // Rest des Codes für die Verarbeitung des HTTP-Requests
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  // WLAN-Netzwerke scannen und auf der Webseite anzeigen
  int networkCount = WiFi.scanNetworks();

  if (networkCount == 0) {
    client.println("Keine WLAN-Netzwerke gefunden.");
  } else {
    client.println("<html><body>");
    client.print(networkCount);
    client.println(" WLAN-Netzwerke gefunden:<br>");

    for (int i = 0; i < networkCount; ++i) {
      client.print(i + 1);
      client.print(": ");
      client.println(WiFi.SSID(i));
    }

    client.println("</body></html>");
  }

  // Anfrage zurücksenden
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("");
  delay(1);
  Serial.println("Client trennen");
  Serial.println("");
}

