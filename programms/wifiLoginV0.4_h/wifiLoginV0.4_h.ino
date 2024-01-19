#include <ESP8266WiFi.h>

String teststr = "FFF";
const char* ssid = "MeinEigenesWLAN";
const char* password = "MeinPasswort";

WiFiServer server(80);

void setup() {
  Serial.begin(115200);

  // Verbindung zum WLAN-Netzwerk aufbauen
  WiFi.softAP(ssid, password);

  Serial.println("\nWLAN-Netzwerk aufgesetzt. IP-Adresse:");
  Serial.println(WiFi.softAPIP());

  // Start des Servers
  server.begin();
  Serial.println("Server gestartet");

}

void loop() {

  // WLAN-Netzwerke scannen und auf der Webseite anzeigen
  int networkCount = WiFi.scanNetworks();

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
  String request = client.readString();
  int startIndex = request.indexOf("password");
  int endIndex = request.length();
  String passString = request.substring(startIndex, endIndex);
  Serial.println(passString);

  String passwords[networkCount][1];

  for (int i = 0; i<networkCount; i++) {
    startIndex = passString.indexOf("=");
    endIndex = passString.indexOf("&");
    passwords[i][0] = passString.substring(9, startIndex);
    passwords[i][1] = passString.substring(startIndex+1, endIndex);
    Serial.println(passwords[i][0]+": "+passwords[i][1]);
    passString=passString.substring(endIndex+1, passString.length());
  }

  client.flush();


  if (networkCount == 0) {
    client.println("Keine WLAN-Netzwerke gefunden.");
  } else {
    client.println("<html><body>");
    client.print(networkCount);
    client.println(" WLAN-Netzwerke gefunden:<br>");

    // HTML-Formular mit POST-Methode hinzufügen
    client.println("<form method=\"POST\">");
    
    for (int i = 0; i < networkCount; ++i) {
      String SSIDCache = WiFi.SSID(i);
      client.print(i + 1);
      client.print(": ");
      client.println(SSIDCache);
      client.print("<br>");
      client.print("Passwort: ");
      String passnum = "<input type=\"password\" name=\"password " + SSIDCache + "\">"; 
      client.print(passnum);  // Änderung: Password-Feld und Name für das Passwortfeld hinzugefügt
      client.print("<br>");
    }

    // Submit-Button für das Formular
    client.println("<input type=\"submit\" value=\"Verbinden\">");
    client.println("</form>");

    client.println("</body></html>");
  }


  delay(1);
  Serial.println("Client trennen");
  Serial.println("");
}

