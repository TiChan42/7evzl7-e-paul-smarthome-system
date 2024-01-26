#include <ESP8266WiFi.h>


const char* ssid = "Wlana del Rey";
const char* password = "MeinPasswort";

String website;

WiFiServer server(80);

// Generiert eine Anzeige für die Empfangsstärke
// @var stength 
void getConnectionStrengthNumber(int strength, int viewSize = 5, int min = -120, int max = -40 ){
  
  // Abfangen von Extremwerten/Fehlern
  if(strength < min) strength = min;
  if(strength > max) strength = max;
  
  // Normalisiere den Wert strength auf den Bereich von 0 bis 1
  float normalized_strength = static_cast<float>(strength - min) / (max - min);

  // Teile Wert ein in Kategorien 0-3 (Strenggenommen kann beim Maxwert 4 rauskommen, ist aber egal)
  int scaled_strength = static_cast<int>(normalized_strength * static_cast<float>(viewSize));

  website = website + "<span class=\"ts\">"; 
  for(int i = 0 ; i < scaled_strength ; ++i) website = website + "|";
  website = website + "</span><span class=\"tl\">";
  for(int i = 0 ; i < (viewSize - scaled_strength) ; ++i) website = website + "|";
  website = website + "</span>";
}


void setup() {

  // Beginn der seriellen Kommunikation
  Serial.begin(115200);

  Serial.print("\nStartup.");
  for(int i = 0; i < 10; i++) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(".");

  // Verbindung zum WLAN-Netzwerk aufbauen
  //WiFi.mode(WIFI_AP); //vll wieder einkommentieren
  WiFi.softAP(ssid, password);
  server.begin();

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

  //client.setNoDelay(true);  

  // Warten auf Daten vom Client mit Timeout-Bedingung
  Serial.println("new client connected");
  //unsigned long ultimeout = millis()+250; && (millis()<ultimeout)Testweise auskommentiert

  while(!client.available() ) {
    delay(1);
  }
/*
  if (millis()>ultimeout) { 
    Serial.println("client connection time-out!");
    return; 
  }

  // Erste Zeile des Requests lesen
  String sRequest = client.readStringUntil('\r');
  client.flush();
  // Request leer -> Client Stoppen
  if(sRequest=="") {
    Serial.println("empty request! - stopping client");
    client.stop();
    return;
  }*/

  // Kürzen der HTTP-Request
  String request = client.readString();
  int endIndex = request.length();
  int startIndex = request.indexOf("\n");
  String passString = request.substring(startIndex, endIndex);
  Serial.println(passString);

  client.flush();

  // WLAN-Netzwerke scannen und auf der Webseite anzeigen
  // (sortierte und gefilterte SSIDs)
  int networkCount = WiFi.scanNetworks();
  // init array
  int indices_v1[networkCount];
  for(int i = 0 ; i < networkCount ; ++i) indices_v1[i] = i;

  // Sortiere nach SIgnalstärke (Bubblesort)
  for (int i = 0; i < networkCount-1; ++i) {
    for (int j = 0; j < networkCount-i-1; ++j) {
      // Tausche die Indizes, wenn der Wert von WiFi.RSSI(j) kleiner als WiFi.RSSI(j+1) ist
      if (WiFi.RSSI(indices_v1[j]) < WiFi.RSSI(indices_v1[j+1])) {
        int temp = indices_v1[j];
        indices_v1[j] = indices_v1[j+1];
        indices_v1[j+1] = temp;
      }
    }
  }

  // Erstellt ein Array ohne Duplikate und zählt die nicht duplizierten Netzwerke
  int actualNetworkCount = 0;
  int indices_v2[networkCount];

  for (int i = 0; i < networkCount; ++i){

    // ist der Wert bisher schon vorgekommen?
    bool duplicated = false;
    for (int j = 0 ; j < i ; ++j){
        if(WiFi.SSID(indices_v1[i]).equals(WiFi.SSID(indices_v1[j]))){
          duplicated = true;
          break;
        }
    }
    // Trage das v2 Array den Wert ein und erhöhe den Counter
    if(!duplicated){
      indices_v2[actualNetworkCount] = indices_v1[i];
      ++actualNetworkCount;
    }
  }

  // Erstelle ein Array in der richtigen Größe und übertrage werte
  int networkIndices[actualNetworkCount];
  for(int i = 0 ; i < actualNetworkCount ; ++i) networkIndices[i] = indices_v2[i];


  //HTML-Code für Website
  String website = String(R"(
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Module-WiFi-Setup</title>
    <style>
    :root {--color: 33,131,149;--timing: 0.3s} 
    body {background-color: rgba(var(--color), 0.1);min-height: 95vh;margin: 0;padding: 0;border-bottom: 5vh solid rgb(var(--color));font-family: "Myriad Pro", "Arial", sans-serif;font-size: 24px;text-align: center}
    h1 {margin-top: 5vh;font-size: 48px;color: rgb(var(--color));}
    .content {position:relative;display: inline grid;text-align: center;}
    .logo {position: absolute;width : 50vw;height: 50vw;top: calc(50vh - 25vw);left: 25vw;color: rgba(var(--color), 0.05);}
    .error-message {color: red;font-size: 16px;margin-top: 30px;}
    .error-message.hidden{display: none;}
    .success-message {color: green;font-size: 16px;margin-top: 30px;}
    .success-message.hidden{display: none;}
    .loading-message {color: rgb(var(--color));font-size: 16px;margin-top: 30px;}
    .loading-message.hidden{display: none;}
    .submit-button{display: inline-block;margin-top: 30px;min-width: 15em;width: 30vw;height: 2em;outline: none;color: white;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 1);font-size: 24px;text-align: center;}
    .submit-button:hover{background-color: rgba(var(--color), 0.8);}
    .submit-button:active{background-color: rgba(var(--color), 0.2);border-color: rgb(var(--color));color: rgb(var(--color));}
    .submit-button.hidden{display: none;}
    .password-container {display: flex;margin-top: 20px;min-width: 15em;width: 30vw;position: relative;margin-right: 1em;min-height: 2em;max-height: 2em;overflow: hidden;top: 0.5em;cursor: pointer;text-align: left;white-space: nowrap;color: rgba(var(--color), 0.2);outline: none;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 0.2);}
    .password-container.hidden {display: none;}
    .password-container input {margin-left: 1em;font-size: 24px;width: 80%;outline: none;background: none;border: none;}
    .password-container div {margin:auto;margin-right: 2vb;text-align: center;font-size: 40px;}
    .password-container div:hover {color: rgb(var(--color));}
    .password-container.show-password {cursor: pointer;color: rgb(var(--color));transition: var(--timing) color ease-in-out;}
    .password-container.show-password:hover {color: rgba(var(--color), 0.2);}
    .dropdown-el {margin-top: 10vh;min-width: 15em;width: 30vw;position: relative;margin-right: 1em;min-height: 2em;max-height: 2em;overflow: hidden;top: 0.5em;cursor: pointer;text-align: left;white-space: nowrap;color: #444;outline: none;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 0.2);transition: var(--timing) all ease-in-out;}
    .dropdown-el input:focus + label {background-color: #def;}
    .dropdown-el input {width: 1px;height: 1px;display: inline-block;position: absolute;opacity: 0.01;}
    .dropdown-el label {border-top: 0.06em solid #d9d9d9;display: block;height: 2em;line-height: 2em;padding-left: 1em;padding-right: 3em;cursor: pointer;position: relative;transition: var(--timing) color ease-in-out;}
    .dropdown-el label:nth-child(2) {margin-top: 2em;border-top: 0.06em solid #d9d9d9;} 
    .dropdown-el input:checked + label {display: block;border-top: none;position: absolute;top: 0;width: 100%;&:nth-child(2) {margin-top: 0;position: relative;}} 
    .dropdown-el::after {content: "";position: absolute;right: 0.8em;top: 0.9em;border: 0.3em solid rgb(var(--color));border-color: rgb(var(--color)) transparent transparent transparent;transition: 0.4s all ease-in-out;} 
    .dropdown-el.expanded {border: 0.06em solid rgb(var(--color));background: #fff;border-radius: 0.25em;padding: 0;box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 5px 0px;max-height: 15em;} .dropdown-el.expanded label {border-top: 0.06em solid #d9d9d9;} 
    .dropdown-el.expanded label:not(#ssid-info-select-label):hover,.dropdown-el.expanded input:not(#ssid-info-select-label):checked + label:not(#ssid-info-select-label) {color: rgb(var(--color));}.dropdown-el.expanded::after {transform: rotate(-180deg);top: 0.55em;}</style></head>
    <body>
    <div class="logo"><svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"viewbox="0 0 512 512"fill="currentColor">
    <path d="M25.3483 31.5C25.5557 31.0203 25.6286 30.8785 25.875 30.4794L26.4433 30.5677C27.6875 32.0012 28.5021 33.8247 29.3677 35.5035L70.3768 113.948L157.133 282.088L204.963 377.357L244.698 463.968C245.341 465.487 246.218 467.096 246.486 468.722L25.7297 231.173C24.7549 230.134 25.0756 229.068 25.0906 227.727L25.1697 52.53C25.1719 45.5838 24.7898 38.4105 25.3483 31.5Z"/>
    <path d="M265.342 469.836C265.169 470.075 264.846 470.313 264.625 470.512L264.578 470.125C265.077 465.574 273.804 447.004 275.995 442.108L285.479 421.253L344.871 302.529L418.54 159.82L429.771 136.979L479.298 41.9564C481.273 38.4482 483.278 34.221 486.129 31.375C487.907 31.0444 487.13 34.8831 487.091 36.035L487.205 229.965C487.229 230.917 486.244 231.943 485.621 232.653L386.606 337.406L297.38 433.378L265.342 469.836Z"/>
    <path d="M204.248 324.63L121.934 166.332C125.154 164.817 128.212 162.847 131.25 160.998L191.588 123.297L232.45 98.8493C236.471 96.4601 240.325 93.761 244.616 91.875C245.071 94.548 244.779 97.5734 244.774 100.277L245.279 406.027C245.039 405.402 244.843 404.875 244.406 404.355L204.248 324.63Z"/>
    <path d="M307.37 324.687L267.667 405.517L268.268 91.708C270.901 92.6367 273.46 94.5079 275.841 95.9491L381.767 161.304C384.325 162.741 387.367 164.045 389.453 166.131C386.825 172.755 382.845 178.97 379.438 185.228L307.37 324.687Z"/></svg></div>
    <div class="content"><h1>WiFi-Setup</h1>  
    <span class="dropdown-el">
    <input type="radio"name="sortType"value="none"checked="checked"id="ssid-info-select"><label id="ssid-info-select-label"style="font-weight: bold;"for="ssid-info-select">Select your WiFi:</label>
)");

  // Einbinden der gescannten Netzwerke
  for (int i = 0; i < actualNetworkCount; ++i) {
    String SSIDCache = WiFi.SSID(networkIndices[i]);
    int signalStrength = WiFi.RSSI(networkIndices[i]);

    website = website + "\n<input type=\"radio\" name=\"sortType\" value=\"" + String(networkIndices[i]) + "\" id=\"ssid-" + String(networkIndices[i]) + "\"><label for=\"ssid-" + String(networkIndices[i])+"\">\n";
    getConnectionStrengthNumber(signalStrength);
    website = website + "\n" + SSIDCache + "<span class=\"tooltip\">" + SSIDCache + "</span></label>";
  }


  website = website + String(R"(</span>
    <!--Password-->
    <div class="password-container hidden" >
    <input type="password"name="password"id="password"placeholder="Your WiFi Password"><div for="password"class="show-password">
    <svg xmlns="http://www.w3.org/2000/svg"width="30px"height="30px"fill="currentColor"class="bi bi-eye"viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg></div></div>

    <!--Submit Button-->
    <button class="submit-button hidden" onclick="clickSubmitButton() ">Try to connect</button>
    <div class="error-message hidden">Something went wrong. Please reload Site.</div>
    <div class="success-message hidden">Successful Connected to your WiFi. You can now leave.</div>
    <div class="loading-message hidden">Try to Connect ... please wait ...</div>
    </div>
    <script>
    var dropdownElements = document.querySelectorAll(".dropdown-el");var password_container = document.querySelector(".password-container");
    dropdownElements.forEach(function (dropdownEl) {dropdownEl.addEventListener("click", function (e) {e.preventDefault();e.stopPropagation();dropdownEl.classList.toggle("expanded");var targetInputId = e.target.getAttribute("for");if (targetInputId) {if (targetInputId != "ssid-info-select") {var targetInput = document.getElementById(targetInputId);if (targetInput) {targetInput.checked = true;password_container.classList.remove("hidden");}}}});});
    document.addEventListener("click", function () {dropdownElements.forEach(function (dropdownEl) {dropdownEl.classList.remove("expanded");});});
    var passwordInput = document.getElementById("password");var showPasswordLabel = document.querySelector(".password-container .show-password");
    showPasswordLabel.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showPasswordLabel.innerHTML=
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30px\" height=\"30px\" fill=\"currentColor\" class=\"bi bi-eye-slash\" viewBox=\"0 0 16 16\"> " +
        "<path d=\"M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z\"/>" +
        "<path d=\"M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829\"/><path d=\"M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z\"/></svg>";} 
      else {passwordInput.type = "password";showPasswordLabel.innerHTML=
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30px\" height=\"30px\" fill=\"currentColor\" class=\"bi bi-eye\" viewBox=\"0 0 16 16\">" +
        "<path d=\"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z\"/>" +
        "<path d=\"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0\"/></svg>";}});
    passwordInput.addEventListener("input", function () {if (passwordInput.value.length > 0) {document.querySelector(".submit-button").classList.remove("hidden");} else {document.querySelector(".submit-button").classList.add("hidden");}});
    function clickSubmitButton(){let ssid = document.querySelector("input[name=\"sortType\"]:checked").value;let password = document.querySelector("#password").value;let ssidIndex = document.querySelector("input[name=\"sortType\"]:checked").id.split("-")[1];};
    function sendSuccessMessage(){document.querySelector(".success-message").classList.remove("hidden");document.querySelector(".error-message").classList.add("hidden");document.querySelector(".loading-message").classList.add("hidden");};
    function sendErrorMessage(){document.querySelector(".success-message").classList.add("hidden");document.querySelector(".error-message").classList.remove("hidden");document.querySelector(".loading-message").classList.add("hidden");};
    function sendLoadingMessage(){document.querySelector(".success-message").classList.add("hidden");document.querySelector(".error-message").classList.add("hidden");document.querySelector(".loading-message").classList.remove("hidden");};
    function sendHideMessage(){document.querySelector(".success-message").classList.add("hidden");document.querySelector(".error-message").classList.add("hidden");document.querySelector(".loading-message").classList.add("hidden");};
    </script></body></html>
  )");

  client.print(website);

  delay(10);
  Serial.println("Client trennen\n" );

} 