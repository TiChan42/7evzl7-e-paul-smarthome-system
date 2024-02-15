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
/*
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
      bool dup = false;
      for(int j; j < networkCount; j++){
        if(WiFi.SSID(j) == SSIDCache){
          dup = true;
        }
      }
      
      client.print(i + 1);
      client.print(": ");

      //client.print("<p> Strength: " + signalStrength + "</p>");
      client.print("<input type=\"radio\" id =\"" + SSIDCache + "\"value=\"" + SSIDCache + "\" name = \"Wifi\">"  );
      client.print(" <label style='color:red;' for=\"" + SSIDCache + "\">" + SSIDCache + "<pre>          -Strength: " + signalStrength + "</pre> </label>");
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
*/

client.print("<!DOCTYPE html> \
<html lang=\"en\"> \
<head> \
<meta charset=\"UTF-8\"> \
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> \
<title>Module-WiFi-Setup</title> \
<style> \
:root { \
--color: 33,131,149; \
--timing: 0.3s; \
} \
 \
body { \
 \
background-color: rgba(var(--color), 0.1); \
min-height: 95vh; \
margin: 0; \
padding: 0; \
border-bottom: 5vh solid rgb(var(--color)); \
font-family: \"Myriad Pro\", \"Arial\", sans-serif; \
font-size: 24px; \
 \
text-align: center; \
 \
} \
 \
h1 { \
margin-top: 5vh; \
font-size: 48px; \
color: rgb(var(--color)); \
} \
 \
.content { \
position:relative; \
display: inline grid; \
text-align: center; \
} \
.logo { \
position: absolute; \
width : 50vw; \
height: 50vw; \
top: calc(50vh - 25vw); \
left: 25vw; \
color: rgba(var(--color), 0.05); \
 \
} \
 \
.error-message { \
color: red; \
font-size: 16px; \
margin-top: 30px; \
} \
.error-message.hidden{ \
display: none; \
} \
 \
.success-message { \
color: green; \
font-size: 16px; \
margin-top: 30px; \
} \
.success-message.hidden{ \
display: none; \
} \
 \
.loading-message { \
color: rgb(var(--color)); \
font-size: 16px; \
margin-top: 30px; \
} \
.loading-message.hidden{ \
display: none; \
} \
 \
 \
.submit-button{ \
display: inline-block; \
margin-top: 30px; \
 \
min-width: 15em; \
width: 30vw; \
height: 2em; \
 \
outline: none; \
color: white; \
border: 0.06em solid transparent; \
border-radius: 1em; \
background-color: rgba(var(--color), 1); \
font-size: 24px; \
text-align: center; \
} \
.submit-button:hover{ \
background-color: rgba(var(--color), 0.8); \
} \
.submit-button:active{ \
background-color: rgba(var(--color), 0.2); \
border-color: rgb(var(--color)); \
color: rgb(var(--color)); \
} \
.submit-button.hidden{ \
display: none; \
} \
 \
.password-container { \
display: flex; \
margin-top: 20px; \
 \
min-width: 15em; \
width: 30vw; \
position: relative; \
margin-right: 1em; \
min-height: 2em; \
max-height: 2em; \
overflow: hidden; \
top: 0.5em; \
cursor: pointer; \
text-align: left; \
white-space: nowrap; \
color: rgba(var(--color), 0.2); \
 \
outline: none; \
border: 0.06em solid transparent; \
border-radius: 1em; \
background-color: rgba(var(--color), 0.2); \
} \
.password-container.hidden { \
display: none; \
} \
 \
.password-container input { \
margin-left: 1em; \
font-size: 24px; \
width: 80%; \
outline: none; \
background: none; \
border: none; \
} \
 \
.password-container div { \
margin:auto; \
margin-right: 2vb; \
text-align: center; \
font-size: 40px; \
} \
 \
.password-container div:hover { \
color: rgb(var(--color)); \
} \
 \
.password-container .show-password { \
cursor: pointer; \
color: rgb(var(--color)); \
transition: var(--timing) color ease-in-out; \
} \
 \
.password-container .show-password:hover { \
color: rgba(var(--color), 0.2); \
} \
 \
.dropdown-el { \
margin-top: 10vh; \
 \
min-width: 15em; \
width: 30vw; \
position: relative; \
margin-right: 1em; \
min-height: 2em; \
max-height: 2em; \
overflow: hidden; \
top: 0.5em; \
cursor: pointer; \
text-align: left; \
white-space: nowrap; \
color: #444; \
 \
outline: none; \
border: 0.06em solid transparent; \
border-radius: 1em; \
background-color: rgba(var(--color), 0.2); \
 \
transition: var(--timing) all ease-in-out; \
} \
 \
.dropdown-el input:focus + label { \
background-color: #def; \
} \
 \
.dropdown-el input { \
width: 1px; \
height: 1px; \
display: inline-block; \
position: absolute; \
opacity: 0.01; \
} \
 \
.dropdown-el label { \
border-top: 0.06em solid #d9d9d9; \
display: block; \
height: 2em; \
line-height: 2em; \
padding-left: 1em; \
padding-right: 3em; \
cursor: pointer; \
position: relative; \
transition: var(--timing) color ease-in-out; \
} \
 \
.dropdown-el label:nth-child(2) { \
margin-top: 2em; \
border-top: 0.06em solid #d9d9d9; \
} \
 \
.dropdown-el input:checked + label { \
display: block; \
border-top: none; \
position: absolute; \
top: 0; \
width: 100%; \
 \
&:nth-child(2) { \
margin-top: 0; \
position: relative; \
} \
} \
 \
.dropdown-el::after { \
content: \"\"; \
position: absolute; \
right: 0.8em; \
top: 0.9em; \
border: 0.3em solid rgb(var(--color)); \
border-color: rgb(var(--color)) transparent transparent transparent; \
transition: 0.4s all ease-in-out; \
} \
 \
.dropdown-el.expanded { \
border: 0.06em solid rgb(var(--color)); \
background: #fff; \
border-radius: 0.25em; \
padding: 0; \
box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 5px 0px; \
max-height: 15em; \
} \
 \
.dropdown-el.expanded label { \
border-top: 0.06em solid #d9d9d9; \
} \
 \
.dropdown-el.expanded label:not(#ssid-info-select-label):hover, \
.dropdown-el.expanded input:not(#ssid-info-select-label):checked + label:not(#ssid-info-select-label) { \
color: rgb(var(--color)); \
} \
 \
.dropdown-el.expanded::after { \
transform: rotate(-180deg); \
top: 0.55em; \
} \
</style> \
</head> \
<body> \
 \
<div class=\"logo\"> \
<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"viewbox=\"0 0 512 512\" fill=\"currentColor\"> \
<path d=\"M25.3483 31.5C25.5557 31.0203 25.6286 30.8785 25.875 30.4794L26.4433 30.5677C27.6875 32.0012 28.5021 33.8247 29.3677 35.5035L70.3768 113.948L157.133 282.088L204.963 377.357L244.698 463.968C245.341 465.487 246.218 467.096 246.486 468.722L25.7297 231.173C24.7549 230.134 25.0756 229.068 25.090 \27.727L25.1697 52.53C25.1719 45.5838 24.7898 38.4105 25.3483 31.5Z\"/> \
<path d=\"M265.342 469.836C265.169 470.075 264.846 470.313 264.625 470.512L264.578 470.125C265.077 465.574 273.804 447.004 275.995 442.108L285.479 421.253L344.871 302.529L418.54 159.82L429.771 136.979L479.298 41.9564C481.273 38.4482 483.278 34.221 486.129 31.375C487.907 31.0444 487.13 34.8831 487.091 \.035L487.205 229.965C487.229 230.917 486.244 231.943 485.621 232.653L386.606 337.406L297.38 433.378L265.342 469.836Z\"/> \
<path d=\"M204.248 324.63L121.934 166.332C125.154 164.817 128.212 162.847 131.25 160.998L191.588 123.297L232.45 98.8493C236.471 96.4601 240.325 93.761 244.616 91.875C245.071 94.548 244.779 97.5734 244.774 100.277L245.279 406.027C245.039 405.402 244.843 404.875 244.406 404.355L204.248 324.63Z\"/> \
<path d=\"M307.37 324.687L267.667 405.517L268.268 91.708C270.901 92.6367 273.46 94.5079 275.841 95.9491L381.767 161.304C384.325 162.741 387.367 164.045 389.453 166.131C386.825 172.755 382.845 178.97 379.438 185.228L307.37 324.687Z\"/> \
</svg> \
</div> \
 \
<div class=\"content\"> \
<h1>WiFi-Setup</h1> \
<span class=\"dropdown-el\"> \
<input type=\"radio\" name=\"sortType\" value=\"none\" checked=\"checked\" id=\"ssid-info-select\"><label id=\"ssid-info-select-label\" style=\"font-weight: bold;\" for=\"ssid-info-select\">Select your WiFi:</label> \
<input type=\"radio\" name=\"sortType\" value=\"0\" id=\"ssid-0\"> \
<label for=\"ssid-0\"> \
<!--hier per code das dem Emfang entsprechende svg einfügen (einfach entsprechend viele der vier ersten Pfade weglassen):--> \
<svg height=\"24px\" width=\"24px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" \
viewBox=\"0 0 507.6 507.6\" xml:space=\"preserve\"> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M269.6,377.8c-4.8-2.4-10.4-4-15.6-4c-18.4,0-33.6,15.2-33.6,33.6S235.6,441,254,441 \
s33.6-15.2,33.6-33.6c0-4-0.8-7.6-2-11.6c-0.4-0.8,0-1.6,0.4-2l-14.4-16.4C271.2,378.2,270.4,378.2,269.6,377.8z\"/> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M336.8,287.8c-24.4-16.8-53.2-26-83.2-26c-38.8,0-75.6,15.2-102.8,42.4c-9.2,9.2-9.2,24.8,0,34 \
c4.4,4.4,10.4,7.6,16.8,7.6l0,0c6.4,0,12.4-2.8,16.8-7.6c18.4-18.4,43.2-28.8,69.6-28.8c26.4,0,51.2,10,69.6,28.8 \
c4.4,4.4,10.4,6.8,16.8,6.8c6.4,0,12.4-2.4,16.8-6.8c9.2-9.2,9.2-24.4,0-33.6c-0.8-0.8-0.8-2,0-2.8L340,287.4 \
C338.8,288.2,338,288.2,336.8,287.8z\"/> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M404,219c-42.8-34.4-94.8-52.4-150-52.4c-64.4,0-124.8,25.2-170.4,70.4c-9.2,9.2-9.2,24.4,0,33.6 \
c4.4,4.4,10.4,7.2,16.8,7.2l0,0c6.4,0,12.4-2.8,16.8-7.2c36.4-36.4,85.2-56.8,136.8-56.8s100.4,20,136.8,56.8 \
c4.4,4.4,10.4,6.8,16.8,6.8c6.4,0,12.4-2.4,16.8-6.8c4.4-4.4,6.8-10.4,6.8-16.8c0-6.4-2.4-12.4-6.8-16.8c-0.8-0.8-0.8-2,0-2.8 \
l-17.6-16C406,219.4,404.8,219.4,404,219z\"/> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M473.6,146.6c-61.2-51.6-139.2-80-219.6-80c-91.2,0-176.4,35.6-240.8,99.6 \
c-4.4,4.4-6.8,10.4-6.8,16.8s2.4,11.6,6.8,16.4c4.4,4.4,10.4,6.4,16.8,6.4l0,0c6.4,0,12.4-2,16.8-6.4 \
c55.2-55.6,128.8-85.6,207.2-85.6s152,30.8,207.6,86c4.4,4.4,10.4,7.2,16.8,7.2s12.4-2.4,16.8-6.8s6.8-10.4,6.8-16.8 \
s-2.4-12.4-6.8-16.8c-0.8-0.8-0.8-2,0-2.8l-18.8-17.2C475.6,147.4,474.4,147.4,473.6,146.6z\"/> \
 \
<path d=\"M254,447c-22,0-39.6-17.6-39.6-39.6s17.6-39.6,39.6-39.6c6.4,0,12.8,1.6,18.4,4.4c2,1.2,2.8,3.6,1.6,5.6s-3.6,2.8-5.6,1.6 \
c-4.4-2.4-9.6-3.6-14.8-3.6c-17.6,0-31.6,14-31.6,31.6s14,31.6,31.6,31.6s31.6-14,31.6-31.6c0-3.6-0.8-7.2-2-10.8 \
c-0.8-2,0.4-4.4,2.4-5.2c2-0.8,4.4,0.4,5.2,2.4c1.6,4.4,2.4,8.8,2.4,13.6C293.6,429.4,275.6,447,254,447z\"/> \
<path d=\"M340.4,351c-8,0-15.6-3.2-21.2-8.8C301.6,324.6,278.4,315,254,315c-24.8,0-47.6,9.6-65.2,26.8c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c28.8-28.4,66.8-44.4,107.2-44.4c31.2,0,61.2,9.2,86.4,27.2 \
c2,1.2,2.4,3.6,0.8,5.6c-1.2,2-3.6,2.4-5.6,0.8c-24-16.8-52.4-25.6-82-25.6c-38.4,0-74.4,14.8-101.6,42c-8.4,8.4-8.4,22.4,0,30.8 \
c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c18.8-18.8,44-29.2,70.8-29.2s52,10.4,71.2,29.6c4,4,9.6,6.4,15.2,6.4 \
c5.6,0,11.2-2.4,15.2-6.4c8.4-8.4,8.4-22.4,0-30.8c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c11.6,11.6,11.6,30.4,0,42 \
C355.6,347.8,348.4,351,340.4,351z\"/> \
<path d=\"M478.4,213c-8,0-15.2-3.2-21.2-8.8c-54.4-54.4-126.4-84.4-203.6-84.4c-76.8,0-148.8,30-203.2,84c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8C3.2,198.2,0,190.6,0,183c0-8,3.2-15.2,8.8-20.8C74.4,96.6,161.2,60.6,254,60.6 \
c82,0,161.2,28.8,223.6,81.6c1.6,1.6,2,4,0.4,5.6s-4,2-5.6,0.4C411.6,97,334,68.6,254,68.6c-90.4,0-175.6,35.2-239.6,99.2 \
c-4,4-6.4,9.6-6.4,15.2s2.4,11.2,6.4,15.2s9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c56-55.6,130-86.4,208.8-86.4 \
s153.2,30.8,209.2,86.8c4,4,9.6,6.4,15.2,6.4c6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2s-2.4-11.2-6.4-15.2c-1.6-1.6-1.6-4,0-5.6 \
s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2s-3.2,15.2-8.8,20.8C493.6,209.8,486.4,213,478.4,213z\"/> \
<path d=\"M407.6,283.8c-8,0-15.2-3.2-21.2-8.8c-35.6-35.6-82.4-55.2-132.8-55.2c-50,0-97.2,19.6-132.4,54.8 \
c-5.6,5.6-13.2,8.8-20.8,8.8l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c46.8-46.4,108.4-72,174.4-72 \
c56.4,0,109.6,18.4,153.6,53.6c1.6,1.2,2,4,0.8,5.6s-4,2-5.6,0.8c-42.4-34-94-52-148.8-52c-63.6,0-123.6,24.8-168.8,70 \
c-8.4,8.4-8.4,22.4,0,30.8c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c36.8-36.8,86-57.2,138-57.2 \
c52.4,0,101.2,20.4,138.4,57.2c4,4,9.6,6.4,15.2,6.4c5.6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2c0-5.6-2.4-11.2-6.4-15.2 \
c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2c0,8-3.2,15.2-8.8,20.8C422.8,280.6,415.6,283.8,407.6,283.8z\"/> \
</svg> \
<!--hier die SSID einfügen:--> \
DHBW Student \
</label> \
<input type=\"radio\" name=\"sortType\" value=\"1\" id=\"ssid-1\"> \
<label for=\"ssid-1\"> \
<!--hier per code das dem Emfang entsprechende svg einfügen :--> \
<svg height=\"24px\" width=\"24px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" \
viewBox=\"0 0 507.6 507.6\" xml:space=\"preserve\"> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M269.6,377.8c-4.8-2.4-10.4-4-15.6-4c-18.4,0-33.6,15.2-33.6,33.6S235.6,441,254,441 \
s33.6-15.2,33.6-33.6c0-4-0.8-7.6-2-11.6c-0.4-0.8,0-1.6,0.4-2l-14.4-16.4C271.2,378.2,270.4,378.2,269.6,377.8z\"/> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M336.8,287.8c-24.4-16.8-53.2-26-83.2-26c-38.8,0-75.6,15.2-102.8,42.4c-9.2,9.2-9.2,24.8,0,34 \
c4.4,4.4,10.4,7.6,16.8,7.6l0,0c6.4,0,12.4-2.8,16.8-7.6c18.4-18.4,43.2-28.8,69.6-28.8c26.4,0,51.2,10,69.6,28.8 \
c4.4,4.4,10.4,6.8,16.8,6.8c6.4,0,12.4-2.4,16.8-6.8c9.2-9.2,9.2-24.4,0-33.6c-0.8-0.8-0.8-2,0-2.8L340,287.4 \
C338.8,288.2,338,288.2,336.8,287.8z\"/> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M404,219c-42.8-34.4-94.8-52.4-150-52.4c-64.4,0-124.8,25.2-170.4,70.4c-9.2,9.2-9.2,24.4,0,33.6 \
c4.4,4.4,10.4,7.2,16.8,7.2l0,0c6.4,0,12.4-2.8,16.8-7.2c36.4-36.4,85.2-56.8,136.8-56.8s100.4,20,136.8,56.8 \
c4.4,4.4,10.4,6.8,16.8,6.8c6.4,0,12.4-2.4,16.8-6.8c4.4-4.4,6.8-10.4,6.8-16.8c0-6.4-2.4-12.4-6.8-16.8c-0.8-0.8-0.8-2,0-2.8 \
l-17.6-16C406,219.4,404.8,219.4,404,219z\"/> \
 \
 \
 \
<path d=\"M254,447c-22,0-39.6-17.6-39.6-39.6s17.6-39.6,39.6-39.6c6.4,0,12.8,1.6,18.4,4.4c2,1.2,2.8,3.6,1.6,5.6s-3.6,2.8-5.6,1.6 \
c-4.4-2.4-9.6-3.6-14.8-3.6c-17.6,0-31.6,14-31.6,31.6s14,31.6,31.6,31.6s31.6-14,31.6-31.6c0-3.6-0.8-7.2-2-10.8 \
c-0.8-2,0.4-4.4,2.4-5.2c2-0.8,4.4,0.4,5.2,2.4c1.6,4.4,2.4,8.8,2.4,13.6C293.6,429.4,275.6,447,254,447z\"/> \
<path d=\"M340.4,351c-8,0-15.6-3.2-21.2-8.8C301.6,324.6,278.4,315,254,315c-24.8,0-47.6,9.6-65.2,26.8c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c28.8-28.4,66.8-44.4,107.2-44.4c31.2,0,61.2,9.2,86.4,27.2 \
c2,1.2,2.4,3.6,0.8,5.6c-1.2,2-3.6,2.4-5.6,0.8c-24-16.8-52.4-25.6-82-25.6c-38.4,0-74.4,14.8-101.6,42c-8.4,8.4-8.4,22.4,0,30.8 \
c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c18.8-18.8,44-29.2,70.8-29.2s52,10.4,71.2,29.6c4,4,9.6,6.4,15.2,6.4 \
c5.6,0,11.2-2.4,15.2-6.4c8.4-8.4,8.4-22.4,0-30.8c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c11.6,11.6,11.6,30.4,0,42 \
C355.6,347.8,348.4,351,340.4,351z\"/> \
<path d=\"M478.4,213c-8,0-15.2-3.2-21.2-8.8c-54.4-54.4-126.4-84.4-203.6-84.4c-76.8,0-148.8,30-203.2,84c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8C3.2,198.2,0,190.6,0,183c0-8,3.2-15.2,8.8-20.8C74.4,96.6,161.2,60.6,254,60.6 \
c82,0,161.2,28.8,223.6,81.6c1.6,1.6,2,4,0.4,5.6s-4,2-5.6,0.4C411.6,97,334,68.6,254,68.6c-90.4,0-175.6,35.2-239.6,99.2 \
c-4,4-6.4,9.6-6.4,15.2s2.4,11.2,6.4,15.2s9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c56-55.6,130-86.4,208.8-86.4 \
s153.2,30.8,209.2,86.8c4,4,9.6,6.4,15.2,6.4c6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2s-2.4-11.2-6.4-15.2c-1.6-1.6-1.6-4,0-5.6 \
s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2s-3.2,15.2-8.8,20.8C493.6,209.8,486.4,213,478.4,213z\"/> \
<path d=\"M407.6,283.8c-8,0-15.2-3.2-21.2-8.8c-35.6-35.6-82.4-55.2-132.8-55.2c-50,0-97.2,19.6-132.4,54.8 \
c-5.6,5.6-13.2,8.8-20.8,8.8l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c46.8-46.4,108.4-72,174.4-72 \
c56.4,0,109.6,18.4,153.6,53.6c1.6,1.2,2,4,0.8,5.6s-4,2-5.6,0.8c-42.4-34-94-52-148.8-52c-63.6,0-123.6,24.8-168.8,70 \
c-8.4,8.4-8.4,22.4,0,30.8c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c36.8-36.8,86-57.2,138-57.2 \
c52.4,0,101.2,20.4,138.4,57.2c4,4,9.6,6.4,15.2,6.4c5.6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2c0-5.6-2.4-11.2-6.4-15.2 \
c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2c0,8-3.2,15.2-8.8,20.8C422.8,280.6,415.6,283.8,407.6,283.8z\"/> \
</svg> \
<!--hier die SSID einfügen:--> \
DHBW Gast \
</label> \
<input type=\"radio\" name=\"sortType\" value=\"2\" id=\"ssid-2\"> \
<label for=\"ssid-2\"> \
<!--hier per code das dem Emfang entsprechende svg einfügen :--> \
<svg height=\"24px\" width=\"24px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" \
viewBox=\"0 0 507.6 507.6\" xml:space=\"preserve\"> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M269.6,377.8c-4.8-2.4-10.4-4-15.6-4c-18.4,0-33.6,15.2-33.6,33.6S235.6,441,254,441 \
s33.6-15.2,33.6-33.6c0-4-0.8-7.6-2-11.6c-0.4-0.8,0-1.6,0.4-2l-14.4-16.4C271.2,378.2,270.4,378.2,269.6,377.8z\"/> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M336.8,287.8c-24.4-16.8-53.2-26-83.2-26c-38.8,0-75.6,15.2-102.8,42.4c-9.2,9.2-9.2,24.8,0,34 \
c4.4,4.4,10.4,7.6,16.8,7.6l0,0c6.4,0,12.4-2.8,16.8-7.6c18.4-18.4,43.2-28.8,69.6-28.8c26.4,0,51.2,10,69.6,28.8 \
c4.4,4.4,10.4,6.8,16.8,6.8c6.4,0,12.4-2.4,16.8-6.8c9.2-9.2,9.2-24.4,0-33.6c-0.8-0.8-0.8-2,0-2.8L340,287.4 \
C338.8,288.2,338,288.2,336.8,287.8z\"/> \
 \
<path d=\"M254,447c-22,0-39.6-17.6-39.6-39.6s17.6-39.6,39.6-39.6c6.4,0,12.8,1.6,18.4,4.4c2,1.2,2.8,3.6,1.6,5.6s-3.6,2.8-5.6,1.6 \
c-4.4-2.4-9.6-3.6-14.8-3.6c-17.6,0-31.6,14-31.6,31.6s14,31.6,31.6,31.6s31.6-14,31.6-31.6c0-3.6-0.8-7.2-2-10.8 \
c-0.8-2,0.4-4.4,2.4-5.2c2-0.8,4.4,0.4,5.2,2.4c1.6,4.4,2.4,8.8,2.4,13.6C293.6,429.4,275.6,447,254,447z\"/> \
<path d=\"M340.4,351c-8,0-15.6-3.2-21.2-8.8C301.6,324.6,278.4,315,254,315c-24.8,0-47.6,9.6-65.2,26.8c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c28.8-28.4,66.8-44.4,107.2-44.4c31.2,0,61.2,9.2,86.4,27.2 \
c2,1.2,2.4,3.6,0.8,5.6c-1.2,2-3.6,2.4-5.6,0.8c-24-16.8-52.4-25.6-82-25.6c-38.4,0-74.4,14.8-101.6,42c-8.4,8.4-8.4,22.4,0,30.8 \
c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c18.8-18.8,44-29.2,70.8-29.2s52,10.4,71.2,29.6c4,4,9.6,6.4,15.2,6.4 \
c5.6,0,11.2-2.4,15.2-6.4c8.4-8.4,8.4-22.4,0-30.8c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c11.6,11.6,11.6,30.4,0,42 \
C355.6,347.8,348.4,351,340.4,351z\"/> \
<path d=\"M478.4,213c-8,0-15.2-3.2-21.2-8.8c-54.4-54.4-126.4-84.4-203.6-84.4c-76.8,0-148.8,30-203.2,84c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8C3.2,198.2,0,190.6,0,183c0-8,3.2-15.2,8.8-20.8C74.4,96.6,161.2,60.6,254,60.6 \
c82,0,161.2,28.8,223.6,81.6c1.6,1.6,2,4,0.4,5.6s-4,2-5.6,0.4C411.6,97,334,68.6,254,68.6c-90.4,0-175.6,35.2-239.6,99.2 \
c-4,4-6.4,9.6-6.4,15.2s2.4,11.2,6.4,15.2s9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c56-55.6,130-86.4,208.8-86.4 \
s153.2,30.8,209.2,86.8c4,4,9.6,6.4,15.2,6.4c6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2s-2.4-11.2-6.4-15.2c-1.6-1.6-1.6-4,0-5.6 \
s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2s-3.2,15.2-8.8,20.8C493.6,209.8,486.4,213,478.4,213z\"/> \
<path d=\"M407.6,283.8c-8,0-15.2-3.2-21.2-8.8c-35.6-35.6-82.4-55.2-132.8-55.2c-50,0-97.2,19.6-132.4,54.8 \
c-5.6,5.6-13.2,8.8-20.8,8.8l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c46.8-46.4,108.4-72,174.4-72 \
c56.4,0,109.6,18.4,153.6,53.6c1.6,1.2,2,4,0.8,5.6s-4,2-5.6,0.8c-42.4-34-94-52-148.8-52c-63.6,0-123.6,24.8-168.8,70 \
c-8.4,8.4-8.4,22.4,0,30.8c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c36.8-36.8,86-57.2,138-57.2 \
c52.4,0,101.2,20.4,138.4,57.2c4,4,9.6,6.4,15.2,6.4c5.6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2c0-5.6-2.4-11.2-6.4-15.2 \
c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2c0,8-3.2,15.2-8.8,20.8C422.8,280.6,415.6,283.8,407.6,283.8z\"/> \
</svg> \
<!--hier die SSID einfügen:--> \
Gratis Viren \
</label> \
<input type=\"radio\" name=\"sortType\" value=\"3\" id=\"ssid-3\"> \
<label for=\"ssid-3\"> \
<!--hier per code das dem Emfang entsprechende svg einfügen :--> \
<svg height=\"24px\" width=\"24px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" \
viewBox=\"0 0 507.6 507.6\" xml:space=\"preserve\"> \
 \
<path style=\"fill:rgb(var(--color));\" d=\"M269.6,377.8c-4.8-2.4-10.4-4-15.6-4c-18.4,0-33.6,15.2-33.6,33.6S235.6,441,254,441 \
s33.6-15.2,33.6-33.6c0-4-0.8-7.6-2-11.6c-0.4-0.8,0-1.6,0.4-2l-14.4-16.4C271.2,378.2,270.4,378.2,269.6,377.8z\"/> \
 \
<path d=\"M254,447c-22,0-39.6-17.6-39.6-39.6s17.6-39.6,39.6-39.6c6.4,0,12.8,1.6,18.4,4.4c2,1.2,2.8,3.6,1.6,5.6s-3.6,2.8-5.6,1.6 \
c-4.4-2.4-9.6-3.6-14.8-3.6c-17.6,0-31.6,14-31.6,31.6s14,31.6,31.6,31.6s31.6-14,31.6-31.6c0-3.6-0.8-7.2-2-10.8 \
c-0.8-2,0.4-4.4,2.4-5.2c2-0.8,4.4,0.4,5.2,2.4c1.6,4.4,2.4,8.8,2.4,13.6C293.6,429.4,275.6,447,254,447z\"/> \
<path d=\"M340.4,351c-8,0-15.6-3.2-21.2-8.8C301.6,324.6,278.4,315,254,315c-24.8,0-47.6,9.6-65.2,26.8c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c28.8-28.4,66.8-44.4,107.2-44.4c31.2,0,61.2,9.2,86.4,27.2 \
c2,1.2,2.4,3.6,0.8,5.6c-1.2,2-3.6,2.4-5.6,0.8c-24-16.8-52.4-25.6-82-25.6c-38.4,0-74.4,14.8-101.6,42c-8.4,8.4-8.4,22.4,0,30.8 \
c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c18.8-18.8,44-29.2,70.8-29.2s52,10.4,71.2,29.6c4,4,9.6,6.4,15.2,6.4 \
c5.6,0,11.2-2.4,15.2-6.4c8.4-8.4,8.4-22.4,0-30.8c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c11.6,11.6,11.6,30.4,0,42 \
C355.6,347.8,348.4,351,340.4,351z\"/> \
<path d=\"M478.4,213c-8,0-15.2-3.2-21.2-8.8c-54.4-54.4-126.4-84.4-203.6-84.4c-76.8,0-148.8,30-203.2,84c-5.6,5.6-13.2,8.8-20.8,8.8 \
l0,0c-8,0-15.2-3.2-20.8-8.8C3.2,198.2,0,190.6,0,183c0-8,3.2-15.2,8.8-20.8C74.4,96.6,161.2,60.6,254,60.6 \
c82,0,161.2,28.8,223.6,81.6c1.6,1.6,2,4,0.4,5.6s-4,2-5.6,0.4C411.6,97,334,68.6,254,68.6c-90.4,0-175.6,35.2-239.6,99.2 \
c-4,4-6.4,9.6-6.4,15.2s2.4,11.2,6.4,15.2s9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c56-55.6,130-86.4,208.8-86.4 \
s153.2,30.8,209.2,86.8c4,4,9.6,6.4,15.2,6.4c6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2s-2.4-11.2-6.4-15.2c-1.6-1.6-1.6-4,0-5.6 \
s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2s-3.2,15.2-8.8,20.8C493.6,209.8,486.4,213,478.4,213z\"/> \
<path d=\"M407.6,283.8c-8,0-15.2-3.2-21.2-8.8c-35.6-35.6-82.4-55.2-132.8-55.2c-50,0-97.2,19.6-132.4,54.8 \
c-5.6,5.6-13.2,8.8-20.8,8.8l0,0c-8,0-15.2-3.2-20.8-8.8c-11.6-11.6-11.6-30.4,0-42c46.8-46.4,108.4-72,174.4-72 \
c56.4,0,109.6,18.4,153.6,53.6c1.6,1.2,2,4,0.8,5.6s-4,2-5.6,0.8c-42.4-34-94-52-148.8-52c-63.6,0-123.6,24.8-168.8,70 \
c-8.4,8.4-8.4,22.4,0,30.8c4,4,9.6,6.4,15.2,6.4l0,0c5.6,0,11.2-2.4,15.2-6.4c36.8-36.8,86-57.2,138-57.2 \
c52.4,0,101.2,20.4,138.4,57.2c4,4,9.6,6.4,15.2,6.4c5.6,0,11.2-2.4,15.2-6.4s6.4-9.6,6.4-15.2c0-5.6-2.4-11.2-6.4-15.2 \
c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c5.6,5.6,8.8,13.2,8.8,21.2c0,8-3.2,15.2-8.8,20.8C422.8,280.6,415.6,283.8,407.6,283.8z\"/> \
</svg> \
<!--hier die SSID einfügen:--> \
WLAN Nr3 \
</label> \
</span> \
 \
<!--Password--> \
 \
<div class=\"password-container hidden\" > \
<input type=\"password\" name=\"password\" id=\"password\" placeholder=\"Your WiFi Password\"> \
<div for=\"password\" class=\"show-password\"> \
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30px\" height=\"30px\" fill=\"currentColor\" class=\"bi bi-eye\" viewBox=\"0 0 16 16\"> \
<path d=\"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z\"/> \
<path d=\"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0\"/> \
</svg> \
</div> \
</div> \
 \
<!--Submit Button--> \
<button class=\"submit-button hidden\" onclick=\"clickSubmitButton()\"> \
Try to connect \
</button> \
 \
<div class=\"error-message hidden\"> \
Something went wrong. Please reload Site. \
</div> \
<div class=\"success-message hidden\"> \
Successful Connected to your WiFi. You can now leave. \
</div> \
<div class=\"loading-message hidden\"> \
Try to Connect ... please wait ... \
</div> \
 \
</div> \
<script> \
// Get all elements with the class 'dropdown-el' \
var dropdownElements = document.querySelectorAll('.dropdown-el'); \
 \
var password_container = document.querySelector('.password-container'); \
 \
// Add a click event listener to each dropdown element \
dropdownElements.forEach(function (dropdownEl) { \
dropdownEl.addEventListener('click', function (e) { \
e.preventDefault(); \
e.stopPropagation(); \
 \
// Toggle the 'expanded' class \
dropdownEl.classList.toggle('expanded'); \
 \
// Get the 'for' attribute of the clicked label and set the corresponding input to checked \
var targetInputId = e.target.getAttribute('for'); \
if (targetInputId) { \
if (targetInputId != \"ssid-info-select\") { \
var targetInput = document.getElementById(targetInputId); \
if (targetInput) { \
targetInput.checked = true; \
password_container.classList.remove('hidden'); \
} \
} \
} \
}); \
}); \
 \
// Add a click event listener to the document \
document.addEventListener('click', function () { \
// Remove the 'expanded' class from all dropdown elements \
dropdownElements.forEach(function (dropdownEl) { \
dropdownEl.classList.remove('expanded'); \
}); \
}); \
 \
// Password shit \
var passwordInput = document.getElementById('password'); \
var showPasswordLabel = document.querySelector('.password-container .show-password'); \
 \
showPasswordLabel.addEventListener('click', function () { \
if (passwordInput.type === 'password') { \
passwordInput.type = 'text'; \
showPasswordLabel.innerHTML='\\ \
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30px\" height=\"30px\" fill=\"currentColor\" class=\"bi bi-eye-slash\" viewBox=\"0 0 16 16\">\\ \
<path d=\"M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z\"/>\\ \
<path d=\"M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829\"/>\\ \
<path d=\"M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z\"/>\\ \
</svg>\\ \
'; \
} else { \
passwordInput.type = 'password'; \
showPasswordLabel.innerHTML='\\ \
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30px\" height=\"30px\" fill=\"currentColor\" class=\"bi bi-eye\" viewBox=\"0 0 16 16\">\\ \
<path d=\"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z\"/>\\ \
<path d=\"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0\"/>\\ \
</svg>\\ \
'; \
} \
}); \
//action listener password input \
passwordInput.addEventListener('input', function () { \
if (passwordInput.value.length > 0) { \
document.querySelector('.submit-button').classList.remove('hidden'); \
} else { \
document.querySelector('.submit-button').classList.add('hidden'); \
} \
}); \
 \
//action listener submit button \
function clickSubmitButton(){ \
let ssid = document.querySelector('input[name=\"sortType\"]:checked').value; \
let password = document.querySelector('#password').value; \
let ssidIndex = document.querySelector('input[name=\"sortType\"]:checked').id.split('-')[1]; \
 \
//Hier kann man die Variablen auslesen \
}; \
 \
 \
 \
function sendSuccessMessage(){ \
document.querySelector('.success-message').classList.remove('hidden'); \
document.querySelector('.error-message').classList.add('hidden'); \
document.querySelector('.loading-message').classList.add('hidden'); \
}; \
function sendErrorMessage(){ \
document.querySelector('.success-message').classList.add('hidden'); \
document.querySelector('.error-message').classList.remove('hidden'); \
document.querySelector('.loading-message').classList.add('hidden'); \
}; \
function sendLoadingMessage(){ \
document.querySelector('.success-message').classList.add('hidden'); \
document.querySelector('.error-message').classList.add('hidden'); \
document.querySelector('.loading-message').classList.remove('hidden'); \
}; \
function sendHideMessage(){ \
document.querySelector('.success-message').classList.add('hidden'); \
document.querySelector('.error-message').classList.add('hidden'); \
document.querySelector('.loading-message').classList.add('hidden'); \
}; \
</script> \
<script> \
//set css color of root to random rgb color every 5 seconds \
var r; \
var g; \
var b; \
setInterval(function () { \
do{ \
r = Math.floor(Math.random() * 255); \
g = Math.floor(Math.random() * 255); \
b = Math.floor(Math.random() * 255); \
}while(r+g+b < 300); \
document.documentElement.style.setProperty('--color', r + ', ' + g + ', ' + b); \
}, 2000); \
 \
</script> \
</body>" );
  delay(1);
  Serial.println("Client trennen" );
  Serial.println("");

} 