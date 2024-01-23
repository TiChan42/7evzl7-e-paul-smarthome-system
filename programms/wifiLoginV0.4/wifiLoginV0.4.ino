#include <ESP8266WiFi.h>

String teststr = "FFF";
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
  String request = client.readString();
  int endIndex = request.length();
  int startIndex = request.indexOf("\n");
  String passString = request.substring(startIndex, endIndex);
  Serial.println(passString);


  client.flush();

  // Überprüfen, ob es sich um eine POST-Anfrage handelt
  //if (request.indexOf("POST") != -1) {
    // Suchen nach dem Beginn der POST-Daten
    /*
    int postDataIndex = request.indexOf("\r\n\r\n") + 4;

    // Benutzerdaten aus dem POST-Request extrahieren
    String postData = request.substring(postDataIndex);
    Serial.print("POST-Daten: ");
    Serial.println(postData);

    // Hier kannst du die POST-Daten weiter analysieren und die Informationen speichern
    if (postData.indexOf("password=") != -1) {
      String passwordValue = postData.substring(postData.indexOf("password=") + 9);
      int endPosition = passwordValue.indexOf("&");
      String passwordInput = passwordValue.substring(0, endPosition);
      Serial.print("Eingegebenes Passwort: ");
      Serial.println(passwordInput);
    }
    */
    //Serial.println(request);
  //}

  // WLAN-Netzwerke scannen und auf der Webseite anzeigen
  int networkCount = WiFi.scanNetworks();

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
      String signalStrength = String(WiFi.RSSI(i));
      bool dup = False;
      for(int j; j < networkCount; j++){
        if(WiFi.SSID(j) == SSIDCache){
          dup = True;
        }
      }
      
      client.print(i + 1);
      client.print(": ");

      //client.print("<p> Strength: " + signalStrength + "</p>");
      client.print("<input type=\"radio\" name =\"" + SSIDCache + "\"value=\"" + SSIDCache + "\">" );
      client.print(" <label style='color:red;' for=\"" + SSIDCache + "\">" + SSIDCache + " Strength: " + signalStrength + "</label>");
        // Änderung: Password-Feld und Name für das Passwortfeld hinzugefügt
      client.print("<br>");
    }

    // Submit-Button für das Formular
    client.print("Passwort: ");
    client.print("<input type=\"password\" name=\"password\" >" );
    client.print("<br>");
    client.println("<input type=\"submit\" value=\"Verbinden\">");
    client.println("</form>");

    client.println("</body></html>");
  }


  delay(1);
  Serial.println("Client trennen");
  Serial.println("");
}

