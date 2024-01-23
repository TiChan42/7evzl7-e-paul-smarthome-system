/* *******************************************************************
   Webclient
   ***************************************************************** */

void sendPost()
// send data as POST to another webserver
// V3 no Arduino String class for sending data
{
  WiFiClient wificlient;
  HTTPClient client;
  const size_t MESSAGE_SIZE_MAX = 300;                     // maximum bytes for Message Buffer
  char message[MESSAGE_SIZE_MAX];                          // the temporary sending message - html body
  char val[32];                                            // buffer to convert floats and integers before appending

  strcpy(message, "board=");                               // Append chars
  strcat(message, TXT_BOARDID);

  strcat(message, "&vcc=");                                // Append integers
  itoa(ESP.getVcc(), val, 10);
  strcat(message, val);

  strcat(message, "&output1=");
  itoa(digitalRead(OUTPUT1_PIN), val, 10);
  strcat(message, val);

  strcat(message, "&output2=");
  itoa(digitalRead(OUTPUT2_PIN), val, 10);
  strcat(message, val);

  strcat(message, "&button1=");
  itoa(digitalRead(BUTTON1_PIN), val, 10);
  strcat(message, val);

  float example = 1234.5678;                               // example how to append floats to the message
  strcat(message, "&float=");
  dtostrf(example, 6, 2, val);
  strcat(message, val);

  client.begin(wificlient, sendHttpTo);                                        // Specify request destination
  client.addHeader("Content-Type", "application/x-www-form-urlencoded");       // Specify content-type header
  int httpCode = client.POST(message);                                         // Send the request
  client.writeToStream(&Serial);                                               // Debug only: Output of received data
  Serial.print(F("\nhttpCode: "));                                             
  Serial.println(httpCode);                                                    // Print HTTP return code

  client.end();  //Close connection
}

/*
void sendPost_V2()
// send data as POST to another webserver
// V2 no String class for sending data 
// uses String class for receiving data
{
  WiFiClient wificlient;
  HTTPClient client;
  const uint16_t MESSAGE_SIZE_MAX = 300;                   // maximum bytes for Message Buffer
  char message[MESSAGE_SIZE_MAX];                          // the temporary sending message - html body
  char val[32];                                            // to convert floats and integers before appending

  strcpy(message, "board=");
  strcat(message, TXT_BOARDID);

  strcat(message, "&vcc=");
  itoa(ESP.getVcc(), val, 10);
  strcat(message, val);

  strcat(message, "&output1=");
  itoa(digitalRead(OUTPUT1_PIN), val, 10);
  strcat(message, val);

  strcat(message, "&output2=");
  itoa(digitalRead(OUTPUT2_PIN), val, 10);
  strcat(message, val);

  strcat(message, "&button1=");
  itoa(digitalRead(BUTTON1_PIN), val, 10);
  strcat(message, val);

  float example = 1234.5678;                               // example how to bring floats into the message
  strcat(message, "&float=");
  dtostrf(example, 6, 2, val);
  strcat(message, val);

  client.begin(wificlient, sendHttpTo);                                        // Specify request destination
  client.addHeader("Content-Type", "application/x-www-form-urlencoded");       // Specify content-type header

  int httpCode = client.POST(message);    // Send the request
  String payload = client.getString();    // Get the response payload

  Serial.println(F("D38"));
  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(F("D40"));
  Serial.println(payload);    //Print request response payload

  client.end();  //Close connection
}


void sendPost_V1()
// send data as POST to another webserver
// This examples is according to https://github.com/esp8266/Arduino/tree/master/libraries/ESP8266HTTPClient
// and uses string class to build the message
{
  Serial.println(F("D050 sendPost()"));
  String message="board=";
  message += TXT_BOARDID;
  message += F("&vcc=");
  message += ESP.getVcc();
  message += "&output1=";
  message += digitalRead(OUTPUT1_PIN);
  message += "&output2=";
  message += digitalRead(OUTPUT2_PIN);
  message += "&button1=";
  message += digitalRead(BUTTON1_PIN);
  
  HTTPClient http;
  http.begin(sendHttpTo);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  http.POST(message);
  http.writeToStream(&Serial);
  http.end();
}
*/
