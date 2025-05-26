// Funktion zum Einrichten des eigenen WLAN-Zugangspunkts
void setUpWiFiAccessPoint(){
  // AP-Modus
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ownSSID, ownSSIDpassword);

  // Routen für den Webserver einrichten
  webServer.on("/", HTTP_GET, handleGET);
  webServer.begin();
  server.begin();
  delay(10);

  Serial.println();
  Serial.println("WLAN-Netzwerk aufgesetzt. IP-Adresse:");
  Serial.println(WiFi.softAPIP());
}

void handleGET() {
  Serial.println("Get empfangen");
  // Definieren von Variablen
  String ssid = "",password = "",user = "";
  int ssidIndex = 0,state = 0;
  String answer = "200";

  // Überprüfe, ob es Variablen gibt
  int status = 0;
  if (webServer.args() > 0) {
    if(webServer.argName(0).equals("state")){
      state = webServer.arg(0).toInt();
      if(state == 0){
        if(webServer.argName(1).equals("ssid")){
            status++;
            ssid = webServer.arg(1);
        }
        if(webServer.argName(2).equals("ssidIndex")){
            status++;
            ssidIndex = webServer.arg(2).toInt();
        }
        if(webServer.argName(3).equals("password")){
            status++;
            password = webServer.arg(3);
        }
      } else if(state == 1){
        status++;
        if(webServer.argName(1).equals("user")){
            status++;
            user = webServer.arg(1);
        }
        if(webServer.argName(2).equals("password")){
            status++;
            password = webServer.arg(2);
        }
      }
    }
  }

  if(status < 3){
    answer = "400";
    answerWebClientRequest(answer);
    return;
  }

  if(state == 0){
    // Versuche eine Verbindung mit dem Wlan aufzubauen
    Serial.println("Try to connect with WiFi: SSID: " + ssid + " Password: " + password);
    WiFi.begin(ssid.c_str(), password.c_str());
    Serial.print("Connecting");
    int maxConnectionTrys = 20;
    int connectionTryCtr = 0;
    while ((WiFi.status() != WL_CONNECTED) && (connectionTryCtr < maxConnectionTrys)) {
      ++connectionTryCtr;
      delay(500);
      Serial.print(".");
    }
    if(maxConnectionTrys <= connectionTryCtr){
      answer = "420";
    } else {
      // Speichern der Daten zur Anmeldung im EEPROM
      writeSSIDToEEPROM(0, ssid);
      writePasswordToEEPROM(0, password);
    }
  } else {
    Serial.println(user);
    Serial.println("hier");
    Serial.println(password);
    if(testLogIn(user, password) == false){
      answer = "400";
    }
  }

  // Feedback geben
  answerWebClientRequest(answer);
}

// Methode zum Senden einer Antwort an die Website
void answerWebClientRequest(String answer){
  // Setze die CORS-Header (nötig zur Fehlervermeidung)
  webServer.sendHeader("Access-Control-Allow-Origin", "*");
  webServer.sendHeader("Access-Control-Max-Age", "10000");
  webServer.sendHeader("Access-Control-Allow-Methods", "GET, POST");
  webServer.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // Sende die Antwort zurück
  webServer.send(200, "text/plain", answer);
}

// Generiert eine Anzeige für die Empfangsstärke
void getConnectionStrengthNumber(String &htmlString, int strength, int viewSize = 5, int min = -120, int max = -40 ) {
  // Fange Extremwerte/Fehler ab
  if(strength < min) strength = min;
  if(strength > max) strength = max;
  if(htmlString.length() == 0) htmlString ="";
  
  // Normalisiere den Wert strength auf den Bereich von 0 bis 1
  float normalized_strength = static_cast<float>(strength - min) / (max - min);

  // Teile Wert ein in Kategorien 0-3 (Strenggenommen kann beim Maxwert 4 rauskommen, ist aber egal)
  int scaled_strength = static_cast<int>(normalized_strength * static_cast<float>(viewSize));

  htmlString+= "<span class=\"ts\">"; 
  for(int i = 0 ; i < scaled_strength ; ++i) htmlString+= "|";
  htmlString+= "</span><span class=\"tl\">";
  for(int i = 0 ; i < (viewSize - scaled_strength) ; ++i) htmlString+= "|";
  htmlString+= "</span>";
}

// Einrichtung des Netzwerks
void tryToSetupViaWebserver(){
  bool setupDone = false;
  while(setupDone == false){
    webServer.handleClient();
    // Überprüfen, ob ein Client verbunden ist
    WiFiClient client = server.available();
    if (!client) {
      continue;
    }
    Serial.println("new client");
    // Warten, bis der Client Daten sendet
    unsigned long ultimeout = millis()+timeOutMillis;
    while(!client.available() && (millis()<ultimeout)) {
      delay(1);
    }
    if(millis()>ultimeout) { 
      Serial.println("client connection time-out!");
      continue; 
    }

    // Die erste Zeile der Anfrage lesen
    String sRequest = client.readStringUntil('\r');
    client.flush();
    
    // Client stoppen, wenn die Anfrage leer ist
    if(sRequest=="") {
      Serial.println("empty request! - stopping client");
      client.stop();
      continue;
    }

    // Pfad, Parameter und Befehl aus der Anfrage extrahieren
    String sPath="",sParam="", sCmd="";
    String sGetstart="GET ";
    int iStart,iEndSpace,iEndQuest;
    iStart = sRequest.indexOf(sGetstart);
    if (iStart>=0) {
      iStart+=+sGetstart.length();
      iEndSpace = sRequest.indexOf(" ",iStart);
      iEndQuest = sRequest.indexOf("?",iStart);
      
      // Abfrage nach Parametern
      if(iEndSpace>0) {
        if(iEndQuest>0) {
          // Parameter vorhanden
          sPath  = sRequest.substring(iStart,iEndQuest);
          sParam = sRequest.substring(iEndQuest,iEndSpace);
        } else {
          // Keine Parameter vorhanden
          sPath  = sRequest.substring(iStart,iEndSpace);
        }
      }
    }

    // Parameter auf der seriellen Schnittstelle ausgeben
    if(sParam.length()>0) {
      int iEqu=sParam.indexOf("=");
      if(iEqu>=0) {
        sCmd = sParam.substring(iEqu+1,sParam.length());
        Serial.println(sCmd);
      }
    }

    // HTML-Antwort formatieren
    String sResponse,sHeader,sResponse1="",sResponse2="",sResponse3="",sResponse4="",sResponse5="";
    int sResponseLength1=0,sResponseLength2=0,sResponseLength3=0,sResponseLength4=0,sResponseLength5=0;

    // 404 für nicht übereinstimmenden Pfad
    if (sPath!="/") {
      sResponse1="<html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>The requested URL was not found on this server.</p></body></html>";
      
      sHeader  = "HTTP/1.1 404 Not found\r\n";
      sHeader += "Content-Length: ";
      sHeader += sResponse1.length();
      sHeader += "\r\n";
      sHeader += "Content-Type: text/html\r\n";
      sHeader += "Connection: close\r\n";
      sHeader += "\r\n";

      //Send answer
      client.print(sHeader);
      client.print(sResponse1);
    } else {
      ulReqcount++;
      // WLAN-Netzwerke scannen und auf der Webseite anzeigen
      // Sortiert und filtert SSIDs
      int networkCount = WiFi.scanNetworks();
      // Array initialisieren
      int indices_v1[networkCount];
      for(int i = 0 ; i < networkCount ; ++i) indices_v1[i] = i;

      // Sortiere von stärkstem zu schwächstem signal (Bubblesort)
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
      
      // Filtern
      // Erstellt ein Array ohne Duplikate und zählt die nicht duplizierten Netzwerke
      int actualNetworkCount = 0;
      int indices_v2[networkCount];

      for (int i = 0; i < networkCount; ++i) {
        bool duplicated = false;
        for (int j = 0 ; j < i ; ++j) {
            if(WiFi.SSID(indices_v1[i]).equals(WiFi.SSID(indices_v1[j]))){
              duplicated = true;
              break;
            }
        }
        if(!duplicated){
          indices_v2[actualNetworkCount] = indices_v1[i];
          ++actualNetworkCount;
        }
      }

      // Erstelle ein Array in der richtigen Größe und übertrage werte
      int networkIndices[actualNetworkCount];
      for(int i = 0 ; i < actualNetworkCount ; ++i) networkIndices[i] = indices_v2[i];

      // HTML String mit inhalt generieren
      // Oberer Website-Teil
      sResponse1  = String(R"(
        <html lang="en"><head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0" >
        <meta http-equiv="Content-Security-Policy: script-src 'self'" content="script-src 'self';">
        <title>Module-WiFi-Setup</title>
        <style>
        :root {--color: 33,131,149;--timing: 0.3s} 
        body {background-color: rgba(var(--color), 0.2);min-height: 95vh;margin: 0;padding: 0;border-bottom: 5vh solid rgb(var(--color));font-family: "Myriad Pro", "Arial", sans-serif;font-size: 24px;text-align: center}
        h1 {margin-top: 5vh;font-size: 48px;color: rgb(var(--color));}
        .content {position:relative;display: inline grid;text-align: center;}
        .logo {position: absolute;width : 50vw;height: 50vw;top: calc(50vh - 25vw);left: 25vw;color: rgba(var(--color), 0.08);}
        .error-message {color: red;font-size: 16px;margin-top: 30px;}
        .error-message.hidden{display: none;}
        .success-message {color: green;font-size: 16px;margin-top: 30px;}
        .success-message.hidden{display: none;}
        .loading-message {color: rgb(var(--color));font-size: 16px;margin-top: 30px;}
        .loading-message.hidden{display: none;}
        .submit-button{display: inline-block;margin-top: 30px;min-width: 15em;width: 40vw;height: 2em;outline: none;color: white;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 1);font-size: 24px;text-align: center;}
        .submit-button:hover{background-color: rgba(var(--color), 0.8);}
        .submit-button:active{background-color: rgba(var(--color), 0.2);border-color: rgb(var(--color));color: rgb(var(--color));}
        .submit-button.hidden{display: none;}
        .password-container {display: flex;margin-top: 20px;min-width: 15em;width: 40vw;position: relative;margin-right: 1em;min-height: 2em;max-height: 2em;overflow: hidden;top: 0.5em;cursor: pointer;text-align: left;white-space: nowrap;color: rgba(var(--color), 0.2);outline: none;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 0.2);}
        .password-container.hidden {display: none;}
        .password-container input {margin-left: 1em;font-size: 24px;width: 80%;outline: none;background: none;border: none;}
        .password-container div {margin:auto;margin-right: 2vb;text-align: center;font-size: 40px;}
        .password-container div:hover {color: rgb(var(--color));}
        .password-container.show-password {cursor: pointer;color: rgb(var(--color));transition: var(--timing) color ease-in-out;}
        .password-container.show-password:hover {color: rgba(var(--color), 0.2);}
        .account-container {display: flex;margin-top: 20px;min-width: 15em;width: 40vw;position: relative;margin-right: 1em;min-height: 2em;max-height: 2em;overflow: hidden;top: 0.5em;cursor: pointer;text-align: left;white-space: nowrap;color: rgba(var(--color), 0.2);outline: none;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 0.2);}
        .account-container.hidden {display: none;}
        .account-container input {margin-left: 1em;font-size: 24px;width: 80%;outline: none;background: none;border: none;}
        .dropdown-el {margin-top: 10vh;min-width: 15em;width: 40vw;position: relative;margin-right: 1em;min-height: 2em;max-height: 2em;overflow: hidden;top: 0.5em;cursor: pointer;text-align: left;white-space: nowrap;color: #444;outline: none;border: 0.06em solid transparent;border-radius: 1em;background-color: rgba(var(--color), 0.2);transition: var(--timing) all ease-in-out;}
        .dropdown-el.hidden {display: none !important;}
        .dropdown-el input:focus + label {background-color: #def;}
        .dropdown-el input {width: 1px;height: 1px;display: inline-block;position: absolute;opacity: 0.01;}
        .dropdown-el label {border-top: 0.06em solid #d9d9d9;display: block;height: 2em;line-height: 2em;padding-left: 1em;padding-right: 3em;cursor: pointer;position: relative;transition: var(--timing) color ease-in-out;}
        .dropdown-el input + label .tooltip {position:fixed; width:auto;left:0;bottom:0;visibility: hidden;background-color:var(--color);color:#fff;text-align: center;padding: 5px;z-index: 1;}
        .dropdown-el input:hover + label .tooltip {visibility: visible;}
        .dropdown-el label:nth-child(2) {margin-top: 2em;border-top: 0.06em solid #d9d9d9;} 
        .dropdown-el input:checked + label {display: block;border-top: none;position: absolute;top: 0;width: 100%;&:nth-child(2) {margin-top: 0;position: relative;}} 
        .dropdown-el::after {content: "";position: absolute;right: 0.8em;top: 0.9em;border: 0.3em solid rgb(var(--color));border-color: rgb(var(--color)) transparent transparent transparent;transition: 0.4s all ease-in-out;} 
        .dropdown-el.expanded {border: 0.06em solid rgb(var(--color));background: #fff;border-radius: 0.25em;padding: 0;box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 5px 0px;max-height: 15em;overflow-y: auto;overflow-x: hidden;} 
        .dropdown-el.expanded label {border-top: 0.06em solid #d9d9d9;} 
        .dropdown-el.expanded label:not(#ssid-info-select-label):hover,.dropdown-el.expanded input:not(#ssid-info-select-label):checked + label:not(#ssid-info-select-label) {color: rgb(var(--color));}.dropdown-el.expanded::after {transform: rotate(-180deg);top: 0.55em;}
        .ts {color:rgba(var(--color),0.7);}
        .tl {color:rgba(var(--color),0.3);}
        </style></head>
        <body>
        <div class="logo"><svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"viewbox="0 0 512 512"fill="currentColor">
        <path d="M25.3483 31.5C25.5557 31.0203 25.6286 30.8785 25.875 30.4794L26.4433 30.5677C27.6875 32.0012 28.5021 33.8247 29.3677 35.5035L70.3768 113.948L157.133 282.088L204.963 377.357L244.698 463.968C245.341 465.487 246.218 467.096 246.486 468.722L25.7297 231.173C24.7549 230.134 25.0756 229.068 25.0906 227.727L25.1697 52.53C25.1719 45.5838 24.7898 38.4105 25.3483 31.5Z"/>
        <path d="M265.342 469.836C265.169 470.075 264.846 470.313 264.625 470.512L264.578 470.125C265.077 465.574 273.804 447.004 275.995 442.108L285.479 421.253L344.871 302.529L418.54 159.82L429.771 136.979L479.298 41.9564C481.273 38.4482 483.278 34.221 486.129 31.375C487.907 31.0444 487.13 34.8831 487.091 36.035L487.205 229.965C487.229 230.917 486.244 231.943 485.621 232.653L386.606 337.406L297.38 433.378L265.342 469.836Z"/>
        <path d="M204.248 324.63L121.934 166.332C125.154 164.817 128.212 162.847 131.25 160.998L191.588 123.297L232.45 98.8493C236.471 96.4601 240.325 93.761 244.616 91.875C245.071 94.548 244.779 97.5734 244.774 100.277L245.279 406.027C245.039 405.402 244.843 404.875 244.406 404.355L204.248 324.63Z"/>
        <path d="M307.37 324.687L267.667 405.517L268.268 91.708C270.901 92.6367 273.46 94.5079 275.841 95.9491L381.767 161.304C384.325 162.741 387.367 164.045 389.453 166.131C386.825 172.755 382.845 178.97 379.438 185.228L307.37 324.687Z"/></svg></div>
        <div class="content"><h1>WiFi-Setup</h1>  
        <span class="dropdown-el">
        <input type="radio"name="sortType"value="none"checked="checked"id="ssid-info-select"><label id="ssid-info-select-label"style="font-weight: bold;"for="ssid-info-select">Wähle dein WiFi:</label>
      )");
      sResponseLength1 = sResponse1.length();


      // Generieren der gescannten Netzwerke als Bausteine
      for (int i = 0; i < actualNetworkCount; ++i) {
        String SSIDCache = WiFi.SSID(networkIndices[i]);
        int signalStrength = WiFi.RSSI(networkIndices[i]);
        String cache = "\n<input type=\"radio\" name=\"sortType\" value=\"" + SSIDCache + "\" id=\"ssid-" + String(networkIndices[i]) + "\"><label for=\"ssid-" + String(networkIndices[i])+"\">\n";
        sResponse2 += cache;
        getConnectionStrengthNumber(sResponse2,signalStrength);
        sResponse2 += "\n" + SSIDCache + "<span class=\"tooltip\">" + SSIDCache + "</span></label>";
        Serial.println(cache);
      }
      delay(1);

      sResponseLength2 = sResponse2.length();

      // Header generieren
      sHeader  = "HTTP/1.1 200 OK\r\n";
      sHeader += "Content-Length: ";
      sHeader += 17854 + sResponseLength2; // die 17854 ergibt sich aus der größe der Statischen elemente
      sHeader += "\r\n";
      sHeader += "Content-Type: text/html\r\n";
      sHeader += "Connection: close\r\n";
      sHeader += "\r\n";

      // Senden von Header + 2 ersten Parts
      client.print(sHeader);
      delay(2);   // Kleine Verzögerung
      client.print(sResponse1);
      delay(2); 
      client.print(sResponse2);
      delay(5); 

      // Löschen der Texte
      sResponse1 = "";
      sResponse2 = "";

      // Generieren des unteren statischen Website-Teils
      sResponse3 += String(R"(
        </span>
        <!--Account-Name-->
        <div class="account-container hidden" >
        <input type="text"name="account"id="account"placeholder="Konto-Anmeldename"maxlength="30">
        </div>
        <!--Password-->
        <div class="password-container hidden" >
        <input type="password"name="password"id="password"placeholder="WiFi-Passwort" maxlength="64"autocomplete="off"><div for="password"class="show-password" >
        <svg xmlns="http://www.w3.org/2000/svg"width="30px"height="30px"fill="currentColor"class="bi bi-eye"viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
        </svg></div></div>
        <!--Submit Button-->
        <button class="submit-button hidden" onclick="clickSubmitButton() ">Verbinden</button>
        <div class="error-message hidden"></div>
        <div class="success-message hidden">Erfolgreich mit WiFi verbunden. Bitte im Konto Anmelden!</div>
        <div class="loading-message hidden">Verbindungsversuch ... bitte warten ...</div>
        </div>
        <script>
        var site_state = 0;
        var dropdownElements = document.querySelectorAll(".dropdown-el");var password_container = document.querySelector(".password-container");
        dropdownElements.forEach(function (dropdownEl) {dropdownEl.addEventListener("click", function (e) {e.preventDefault();e.stopPropagation();dropdownEl.scroll(0,0);dropdownEl.classList.toggle("expanded");var targetInputId = e.target.getAttribute("for");if (targetInputId) {if (targetInputId != "ssid-info-select") {var targetInput = document.getElementById(targetInputId);
        if (targetInput) {targetInput.checked = true;password_container.classList.remove("hidden");document.querySelector(".submit-button").classList.remove("hidden");document.querySelector(".submit-button").classList.remove("hidden");}}}});});
        document.addEventListener("click", function () {dropdownElements.forEach(function (dropdownEl) {dropdownEl.scroll(0,0);dropdownEl.classList.remove("expanded");});});
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
        function sendSuccessMessage(){document.querySelector(".success-message").classList.remove("hidden");document.querySelector(".error-message").classList.add("hidden");document.querySelector(".loading-message").classList.add("hidden");};
        function sendErrorMessage(){document.querySelector(".success-message").classList.add("hidden");document.querySelector(".error-message").classList.remove("hidden");document.querySelector(".loading-message").classList.add("hidden");};
        function sendLoadingMessage(){document.querySelector(".success-message").classList.add("hidden");document.querySelector(".error-message").classList.add("hidden");document.querySelector(".loading-message").classList.remove("hidden");};
        function sendHideMessage(){document.querySelector(".success-message").classList.add("hidden");document.querySelector(".error-message").classList.add("hidden");document.querySelector(".loading-message").classList.add("hidden");};
        )");
        sResponseLength3 = sResponse3.length();
        //senden von Website Teil 3 und reinigen
        client.print(sResponse3);
        delay(5); 
        sResponse3 = "";
        sResponse4 += String(R"(
        function clickSubmitButton(){
          if (site_state == 0){
            sendLoadingMessage();
            let ssid = document.querySelector("input[name=\"sortType\"]:checked").value;
            let password = document.querySelector("#password").value;
            let ssidIndex = document.querySelector("input[name=\"sortType\"]:checked").id.split("-")[1];
            // URL der API und Daten, die gesendet werden sollen
            var apiUrl = 'http://192.168.4.1:50000';
            var data = {
              state : 0,
              ssid: ssid,
              ssidIndex: ssidIndex,
              password: password
            };
            // Erstellt die vollständige URL mit den Daten als Query-Parameter
            var fullUrl = apiUrl + '?' + objectToQueryString(data);
            console.log(fullUrl);
            // Erstellt ein XMLHttpRequest-Objekt
            var xhr = new XMLHttpRequest();
            // Setze die maximale Antwortzeit (Timeout) auf 30 Sekunden
            xhr.timeout = 30000; // Beispiel: 30 Sekunden
            xhr.ontimeout = function () {
              document.querySelector(".error-message").innerHTML = "Timeout! Verbindung zum Modul überprüfen und Seite reloaden!";
              sendHideMessage();
              sendErrorMessage();
            };
            // Konfiguriere die Anfrage mit der GET-Methode und der erstellten URL
            xhr.open('GET', fullUrl, true);
            // Setze die Callback-Funktion für die Antwort
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                if(xhr.responseText == "400"){
                  document.querySelector(".error-message").innerHTML = "Verbindungsfehler! Bitte Seite Reloaden!";
                  sendHideMessage();
                  sendErrorMessage();
                }
                if(xhr.responseText == "420"){
                  document.querySelector(".error-message").innerHTML = "Falsches Passwort! Bitte erneut versuchen!";
                  sendHideMessage();
                  sendErrorMessage();
                }
                if(xhr.responseText == "200"){
                  sendHideMessage();
                  sendSuccessMessage();
                  init_state_1()
                }
                console.log(xhr.responseText);
              }
            };
            // Sende die Anfrage
            xhr.send();
          }else{
            sendLoadingMessage();
            let user = document.querySelector("#account").value;
            let password = document.querySelector("#password").value;
            // URL der API und Daten, die gesendet werden sollen
            var apiUrl = 'http://192.168.4.1:50000';
            var data = {
              state : 1,
              user : user,
              password: password
            };
            // Erstellt die vollständige URL mit den Daten als Query-Parameter
            var fullUrl = apiUrl + '?' + objectToQueryString(data);
            console.log(fullUrl);
            // Erstellt ein XMLHttpRequest-Objekt
            var xhr = new XMLHttpRequest();
            // Setze die maximale Antwortzeit (Timeout) auf 10 Sekunden
            xhr.timeout = 10000; // Beispiel: 10 Sekunden
            xhr.ontimeout = function () {
              document.querySelector(".error-message").innerHTML = "Timeout! Verbindung zum Modul überprüfen und Seite reloaden!";
              sendHideMessage();
              sendErrorMessage();
            };
            // Konfiguriere die Anfrage mit der GET-Methode und der erstellten URL
            xhr.open('GET', fullUrl, true);
            // Setze die Callback-Funktion für die Antwort
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                if(xhr.responseText == "400"){
                  sendHideMessage();
                  sendErrorMessage();
                }
                if(xhr.responseText == "200"){
                  sendHideMessage();
                  document.querySelector(".success-message").innerHTML = "Anmeldung erfolgreich! Weiter in der Web-App";
                  sendSuccessMessage();
                }
                console.log(xhr.responseText);
              }
            };
            // Sende die Anfrage
            xhr.send();
          }
        }
        )");
        sResponseLength4 = sResponse4.length();
        // Senden von Website Teil 4 und reinigen
        client.print(sResponse4);
        delay(5); 
        sResponse4 = "";

        sResponse5 += String(R"(
        // Funktion, um Objekte in Query-Parameter zu konvertieren
        function objectToQueryString(obj) {
          return Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
        }
        function init_state_1(){
          site_state = 1;
          document.querySelector(".dropdown-el").classList.add("hidden");
          document.querySelector(".account-container").classList.remove("hidden");
          document.querySelector("#password").placeholder = "Konto-Passwort";
          document.querySelector("#password").value = "";
          document.querySelector(".submit-button").innerHTML = "Anmelden";
          document.querySelector(".loading-message").innerHTML = "Anmeldeversuch ... bitte warten ...";
          document.querySelector(".error-message").innerHTML = "Anmeldung schiefgelaufen, erneut versuchen";
        }
        </script></body></html>
      )");
        sResponseLength5 = sResponse5.length();
        //senden von Website Teil 5 und reinigen
        client.print(sResponse5);
        delay(5); 
        sResponse5 = "";
    }

    // Die Antwort an den Client senden
    Serial.println(sHeader);
    Serial.print("Lange sResponse 1: ");
    Serial.print(sResponseLength1);
    Serial.println();
    Serial.print("Lange sResponse 2: ");
    Serial.print(sResponseLength2);
    Serial.println();
    Serial.print("Lange sResponse 3: ");
    Serial.print(sResponseLength3);
    Serial.println();
    Serial.print("Lange sResponse 4: ");
    Serial.print(sResponseLength4);
    Serial.println();
    Serial.print("Lange sResponse 5: ");
    Serial.print(sResponseLength5);
    Serial.println();
    int staticHTMLPartsLength = sResponseLength1 + sResponseLength3 + sResponseLength4 + sResponseLength5;
    Serial.print("Lange statische Elemente(immer überall im Dokument anpassen wenn nicht 17854): ");
    Serial.print(staticHTMLPartsLength);
    Serial.println();

    delay(timeOutMillis);
    
    // und den Client stoppen
    client.stop();
    Serial.println("Client disonnected");
  }
}