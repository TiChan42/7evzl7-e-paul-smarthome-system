/* *******************************************************************
   ESP8266 Server and Client
   by noiasca:

   Hardware
   - NodeMCU / ESP8266

   Short
   - simple webserver with some pages
   - Stylesheet (css) optimized for mobile devices
   - webseite update with fetch API
   - control pins via webpage
   - a webclient can send data to another webserver
   - ArduinoOTA upload with Arduino IDE
   - see the full tutorial on: https://werner.rothschopf.net/201809_arduino_esp8266_server_client_0.htm

   Open Tasks
   - open serial monitor and send an g to test client and

   Version
   2021-07-21 (compiles with ESP8266 core 2.7.4 without warnings)
***************************************************************** */

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>                              // for the webserver
#include <ESP8266HTTPClient.h>                             // for the webclient https://github.com/esp8266/Arduino/tree/master/libraries/ESP8266HTTPClient
#include <ESP8266mDNS.h>                                   // Bonjour/multicast DNS, finds the device on network by name
#include <ArduinoOTA.h>                                    // OTA Upload via ArduinoIDE

//#include <credentials.h>                                   // my credentials - remove before upload

#define VERSION "8.3.1"                                    // the version of this sketch
                                                           
#define USE_BOARD 109                                      // the actual board to compile

/* *******************************************************************
         the board settings / die Einstellungen der verschiedenen Boards
 ********************************************************************/

#if USE_BOARD == 103                                       // example board
#define TXT_BOARDID "103"                                  // an ID for the board
#define TXT_BOARDNAME "ESP8266 Server Client"              // the name of the board
#define CSS_MAINCOLOR "blue"                               // don't get confused by the different webservers and use different colors
const uint16_t clientIntervall = 0;                        // intervall to send data to a server in seconds. Set to 0 if you don't want to send data
const char* sendHttpTo = "http://172.18.67.109/d.php";     // the module will send information to that server/resource. Use an URI or an IP address
#endif

#if USE_BOARD == 109                                       // example Board
#define TXT_BOARDID "109"                                  // an ID for the board
#define TXT_BOARDNAME "ESP8266 Server Client"              // the name of the board 
#define CSS_MAINCOLOR "green"                              // don't get confused by the different webservers and use different colors
const uint16_t clientIntervall = 30;                       // intervall to send data to a server in seconds. Set to 30 if you want to send data each 30 seconds
const char* sendHttpTo = "http://172.18.67.103/d.php";     // the module will send information to that server/resource. Use an URI or an IP address
#endif

/* *******************************************************************
         other settings / weitere Einstellungen für den Anwender
 ********************************************************************/

#ifndef STASSID                        // either use an external .h file containing STASSID and STAPSK or ...
#define STASSID "test-123"            // ... modify these line to your SSID
#define STAPSK  "12345678"        // ... and set your WIFI password
#endif

const char* ssid = STASSID;
const char* password = STAPSK;

/* *******************************************************************
         Globals - Variables and constants
 ********************************************************************/

unsigned long ss = 0;                            // current second since startup
const uint16_t ajaxIntervall = 5;                // intervall for AJAX or fetch API call of website in seconds
uint32_t clientPreviousSs = 0 - clientIntervall; // last second when data was sent to server

const uint8_t BUTTON1_PIN = 0;                   // GPIO00/D3 on NodeMCU is the Flash Button - use this for testing an input
const uint8_t OUTPUT1_PIN = 16;                  // GPIO16/D0 on NodeMCU is a (somtimes red, sometimes blue) LED on the NodeMCU Board - use this for testing the html switch
const uint8_t OUTPUT2_PIN = 2;                   // GPIO02/D4 on NodeMCU is the (blue) LED on the ESP-12E
                                                 
ADC_MODE(ADC_VCC);                               // to use getVcc
uint32_t internalVcc = ESP.getVcc();             // this will be used to measure the internal voltage

ESP8266WebServer server(80);                     // an instance for the webserver

#ifndef CSS_MAINCOLOR
#define CSS_MAINCOLOR "#8A0829"                  // fallback if no CSS_MAINCOLOR was declared for the board
#endif

//values from the remote device will be stored in this variables:
uint8_t remoteBoardId = 0;                       // will save the remote board ID
uint8_t remoteButton1 = 0;                       // the input GPIO from the remote ESP
uint8_t remoteOutput1 = 0;                       // the output GPIO from the remote ESP
uint8_t remoteOutput2 = 0;                       // the output GPIO from the remote ESP
uint32_t remoteVcc = 0;                          // the voltage mesarued by remote ESP
uint32_t remoteMessagesSucessfull = 0;           // counter, how many messages where received
uint32_t remoteLastMessage = 0;                  // last message from remote ESP

/* *******************************************************************
         S E T U P
 ********************************************************************/

void setup(void) {
  pinMode(BUTTON1_PIN, INPUT);
  pinMode(OUTPUT1_PIN, OUTPUT);
  pinMode(OUTPUT2_PIN, OUTPUT);
  Serial.begin(115200);
  Serial.println(F("\n" TXT_BOARDNAME "\nVersion: " VERSION " Board " TXT_BOARDID " "));
  Serial.print  (__DATE__);
  Serial.print  (F(" "));
  Serial.println(__TIME__);

  char myhostname[8] = {"esp"};
  strcat(myhostname, TXT_BOARDID);
  WiFi.hostname(myhostname);
  WiFi.begin(ssid, password);
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }
  Serial.println(F(""));
  Serial.print(F("Connected to "));
  Serial.println(ssid);
  Serial.print(F("IP address: "));
  Serial.println(WiFi.localIP());
  if (MDNS.begin("esp8266")) {
    Serial.println(F("MDNS responder started"));
  }
  //define the pages and other content for the webserver
  server.on("/",      handlePage);               // send root page
  server.on("/0.htm", handlePage);               // a request can reuse another handler
  server.on("/1.htm", handlePage1);               
  server.on("/2.htm", handlePage2);               
  server.on("/x.htm", handleOtherPage);          // just another page to explain my usage of HTML pages ...
  
  server.on("/f.css", handleCss);                // a stylesheet                                             
  server.on("/j.js",  handleJs);                 // javscript based on fetch API to update the page
  //server.on("/j.js",  handleAjax);             // a javascript to handle AJAX/JSON update of the page  https://werner.rothschopf.net/201809_arduino_esp8266_server_client_2_ajax.htm                                                
  server.on("/json",  handleJson);               // send data in JSON format
  server.on("/c.php", handleCommand);            // process commands
  server.on("/favicon.ico", handle204);          // process commands
  server.onNotFound(handleNotFound);             // show a typical HTTP Error 404 page

  //the next two handlers are necessary to receive and show data from another module
  server.on("/d.php", handleData);               // receives data from another module
  server.on("/r.htm", handlePageR);              // show data as received from the remote module

  server.begin();                                // start the webserver
  Serial.println(F("HTTP server started"));

  //IDE OTA
  ArduinoOTA.setHostname(myhostname);            // give a name to your ESP for the Arduino IDE
  ArduinoOTA.begin();                            // OTA Upload via ArduinoIDE https://arduino-esp8266.readthedocs.io/en/latest/ota_updates/readme.html
}

/* *******************************************************************
         M A I N L O O P
 ********************************************************************/

void loop(void) {
  ss = millis() / 1000;
  if (clientIntervall > 0 && (ss - clientPreviousSs) >= clientIntervall)
  {
    sendPost();
    clientPreviousSs = ss;
  }
  server.handleClient();
  ArduinoOTA.handle();       // OTA Upload via ArduinoIDE

  // do your calculation, sensor readings etc...

  // add displays, serial outputs here
}