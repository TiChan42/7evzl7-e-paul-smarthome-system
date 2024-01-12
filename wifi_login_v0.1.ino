#include <ESP8266WiFi.h>

#define ledPin 2

const char* ssid = "MeinEigenesWLAN";
const char* password = "epaul";


WiFiServer server(80);

void setup() {
  Serial.begin(115200);

  // Verbindung zum WLAN-Netzwerk aufbauen
  WiFi.softAP(ssid, password);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  Serial.println("WLAN-Netzwerk aufgesetzt. IP-Adresse:");
  Serial.println(WiFi.softAPIP());

  // Start des Servers
  server.begin();
  Serial.println("Server gestartet");
 

}



void loop() {
  // Prüfen, ob sich ein Client verbunden hat
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
 
  // Warten auf Daten vom Client
  Serial.println("new client");
  while(!client.available()){
    delay(1);
  }
 
  // Erste Zeile des Requests lesen
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();
 
  // Match the request
 
  int value = LOW;
  if (request.indexOf("/LED=OFF") != -1)  {
    digitalWrite(ledPin, HIGH);
    value = HIGH;
  }
  if (request.indexOf("/LED=ON") != -1)  {
    digitalWrite(ledPin, LOW);
    value = LOW;
  }
 
  // Anfrage zurücksenden
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("");
  client.println("<!DOCTYPE HTML>");
  client.println("<html>");
 
  client.print("Die LED ist: ");
 
  if(value == HIGH) {
    client.print("Aus");
  } else {
    client.print("An");
  }
  client.println("<br><br>");
  client.println("<a href=\"/LED=ON\"\"><button>An </button></a>");
  client.println("<a href=\"/LED=OFF\"\"><button>Aus </button></a><br />");  
  client.println("</html>");
 
  delay(1);
  Serial.println("Client trennen");
  Serial.println("");
}

