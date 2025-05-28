#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "account_registration.h"
#include "eeprom_utils.h"

// External variables declared in client.ino
extern const char* serverLoginApiUrl;
extern String controllerMode;

// Methode , um den Client am Server zu registrieren
bool testLogIn(String user, String password) {
  // Input validation
  if (user.length() == 0 || password.length() == 0) {
    Serial.println(F("Invalid login credentials - empty fields"));
    return false;
  }
  
  if (user.length() > 100 || password.length() > 100) {
    Serial.println(F("Invalid login credentials - fields too long"));
    return false;
  }
  
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("WiFi not connected"));
    return false;
  }

  bool success = false;
  String controllerType = controllerMode;
  String controllerName = F("ESP32_Controller"); // Better default name
  int eepromStart = 0;

  HTTPClient http;
  http.begin(serverLoginApiUrl);
  http.addHeader(F("Content-Type"), F("application/json"));
  http.setTimeout(10000); // 10 second timeout
  
  // Create JSON payload
  String postData = "{\"email\":\"" + user + 
                   "\",\"password\":\"" + password + 
                   "\",\"name\":\"" + controllerName + 
                   "\",\"type\":\"" + controllerType + "_1\"}";
  
  Serial.println(F("Sending registration request..."));
  // Don't log the actual data for security
  
  int httpResponseCode = http.POST(postData);
  
  if (httpResponseCode > 0) {
    Serial.print(F("HTTP Response code: "));
    Serial.println(httpResponseCode);
    
    String response = http.getString();
    
    if (httpResponseCode == 201) {
      success = handleSuccessfulRegistration(response, user, eepromStart);
    } else {
      Serial.print(F("Registration failed with code: "));
      Serial.println(httpResponseCode);
    }
  } else {
    Serial.print(F("HTTP POST error: "));
    Serial.println(httpResponseCode);
  }
  
  http.end();
  
  if (success) {
    Serial.println(F("Registration successful, restarting..."));
    delay(1000);
    ESP.restart();
  }
  
  return success;
}

bool handleSuccessfulRegistration(const String& response, const String& user, int eepromStart) {
  DynamicJsonDocument jsonDoc(1024);
  DeserializationError error = deserializeJson(jsonDoc, response);
  
  if (error) {
    Serial.print(F("JSON parsing failed: "));
    Serial.println(error.c_str());
    return false;
  }
  
  if (!jsonDoc.containsKey("id") || !jsonDoc.containsKey("key")) {
    Serial.println(F("Missing required fields in response"));
    return false;
  }
  
  int controllerId = jsonDoc["id"];
  const char* key = jsonDoc["key"];
  
  Serial.print(F("Controller ID: "));
  Serial.println(controllerId);
  Serial.println(F("Key received"));
  
  // Save data to EEPROM
  writeTopicToEEPROM(eepromStart, user);
  writeIDToEEPROM(eepromStart, String(controllerId));
  writeKeyToEEPROM(eepromStart, String(key));
  writeModeToEEPROM(eepromStart, controllerMode);
  
  // Verify EEPROM writes
  if (readIDFromEEPROM(eepromStart) != String(controllerId)) {
    Serial.println(F("EEPROM write verification failed for ID"));
    return false;
  }
  
  Serial.println(F("Data successfully saved to EEPROM"));
  return true;
}