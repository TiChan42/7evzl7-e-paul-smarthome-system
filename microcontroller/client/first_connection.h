#ifndef FIRST_CONNECTION_H
#define FIRST_CONNECTION_H

#include <Arduino.h>
#include <WiFiClient.h>

// Configuration constants
namespace WiFiSetupConfig {
    constexpr int WIFI_CONNECTION_TIMEOUT_MS = 10000;
    constexpr int MAX_CONNECTION_ATTEMPTS = 20;
    constexpr int CONNECTION_RETRY_DELAY_MS = 500;
    constexpr int SIGNAL_STRENGTH_BARS = 5;
    constexpr int MIN_SIGNAL_STRENGTH = -120;
    constexpr int MAX_SIGNAL_STRENGTH = -40;
    constexpr size_t PROGMEM_CHUNK_SIZE = 512;
    constexpr int ACCESS_POINT_LED_PIN = 23;  // Information-LED of hexagonz-I
}

// Function declarations for first connection setup
void setUpWiFiAccessPoint();
void handleGET();
void answerWebClientRequest(const String& answer);
void getConnectionStrengthNumber(String &htmlString, int strength, 
                                int viewSize = WiFiSetupConfig::SIGNAL_STRENGTH_BARS, 
                                int min = WiFiSetupConfig::MIN_SIGNAL_STRENGTH, 
                                int max = WiFiSetupConfig::MAX_SIGNAL_STRENGTH);
void sendProgmemString(WiFiClient& client, const char* progmemStr);
void tryToSetupViaWebserver();
void sendMainPage(WiFiClient& client);
void sendErrorPage(WiFiClient& client); 
String generateNetworkList(int* networkIndices, int networkCount);
String parseRequestPath(const String& request);
bool handleClientRequest(WiFiClient& client);
String handleUserLogin(const String& user, const String& password, const String& deviceName); 
String handleWiFiConnection(const String& ssid, const String& password);
int validateRequestParameters(String& ssid, String& password, String& user, int& ssidIndex, int& state, String& deviceName);
void initAccessPointLED();
void setAccessPointLEDState(bool state);


// Response codes
namespace ResponseCodes {
    constexpr const char* SUCCESS = "200";
    constexpr const char* BAD_REQUEST = "400";
    constexpr const char* WIFI_CONNECTION_FAILED = "420";
}

#endif // FIRST_CONNECTION_H
