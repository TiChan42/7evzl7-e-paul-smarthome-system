#include <ESP8266WiFi.h>

#define ledPin 2
 
const char* ssid = "FRITZ!Box 7590 BW";
const char* password = "23277947193261190917";
 

WiFiServer server(80);
 
void setup() {
  Serial.begin(115200);
  delay(10);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
 
  // Mit Wifi verbinden
  Serial.print("Verbinden mit: "); 
  Serial.println(ssid);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi verbunden");
 
  // Start des Servers
  server.begin();
  Serial.println("Server gestartet");
 
  // Print the IP address
  Serial.print("Diese URL zum Verbinden aufrufen: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
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
