#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>


const char* ownSSID = "E_Paul_Module_WiFi";
const char* ownSSIDpassword = "";  

//für anmeldung im Heimnetz
char* loginSSID;  
char* loginSSIDpassword;




unsigned long ulReqcount;
unsigned long timeOutMillis;


// Create an instance of the server on Port 80
WiFiServer server(80);
ESP8266WebServer webServer(50000);

void setup() 
{
  // setup globals
  ulReqcount=0;
  timeOutMillis=500;
  
  // start serial
  Serial.begin(115200);
  delay(1);

  //überprüfung ob schon Eine Verbindung gebaut wurde

  //Falls keine Verbindung hergestellt werden kann, eigenes Wifi aufsetzen
  setUpWiFiAccessPoint();
  //starte einen loop, der versucht die Daten zur Internet Connection zu bekommen
  tryToSetupViaWebserver();
}

void loop() 
{ 

}

