//TODO @Hannes@Mathi muss zur weiterverarbeitung angepasst werden
//TODO @Timo wir brauchen ein input für den controller namen
bool testLogIn(String user, String password){
  //hier erst testen ob es das key value aus passwort und user gibt

  bool success = false;
  String controllerName = "TestName";

  int controllerId;

  const char* key = "";

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;  // Create a WiFiClient object

    HTTPClient http;

    // Use ::begin(client, url) instead of ::begin(url)
    if (http.begin(client, serverLoginApiUrl)) {
      http.addHeader("Content-Type", "application/json");
      
      
      // Your JSON data to be sent in the POST request
      String postData = "{\"email\":\""+ user +"\", \"password\":\""+ password +"\", \"name\":\""+ controllerName +"\"}";
      Serial.println(postData);

      // Send the POST request and capture the response
      int httpResponseCode = http.POST(postData);


      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        
        String response = http.getString();
        Serial.println(response);
        if (httpResponseCode == 201){
          success = true;

          DynamicJsonDocument jsonDoc(1024);
          deserializeJson(jsonDoc, response);

          controllerId = jsonDoc["id"];
          key = jsonDoc["key"];

          Serial.print("id:");
          Serial.println(controllerId);
          Serial.print("key:");
          Serial.println(key);
        }

        
      } else {
        Serial.print("Error in HTTP POST request: ");
        Serial.println(httpResponseCode);
      }

      // End the request
      http.end();
  }

    delay(5000);  // Wait for 5 seconds before making the next request
  }
  return success;
}