#include <Arduino.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "mqtt_utils.h"
#include "lamp_module.h"
#include "button_module.h"
#include "eeprom_utils.h"
#include "hexagonz_module.h"

// External variables declared in client.ino
extern PubSubClient client;
extern char msg[MSG_BUFFER_SIZE];
extern String topic;
extern String mqttUsr;
extern String mqttPw;
extern int eepromStart;
extern bool white_flag;
extern char global_red, global_green, global_blue, global_brightness;
extern bool state, testState, mode, showStateOnLED;

void controllerAnswer(String answer){

  int eepromStart = 0;
  int messageType = 2;
  String topic = ""; 
  String ownID = "";
  String key = "";
  String answerJson = "";
  String status = "";
  String controllerMode = "";

  topic = readTopicFromEEPROM(eepromStart);
  ownID = readIDFromEEPROM(eepromStart);
  key = readKeyFromEEPROM(eepromStart);
  controllerMode = readModeFromEEPROM(eepromStart);

  // Bauen des Status abhängig davon in welchem modus sich der Controller befindet
  if(controllerMode == "lamp"){
    status = "{\"whiteFlag\":\"" + String(int(white_flag)) + "\", \"red\":\"" + String(int(global_red)) + "\", \"green\":\"" + String(int(global_green)) + "\", \"blue\":\"" + String(int(global_blue)) + "\", \"brightness\":\"" + String(int(global_brightness)) + "\"}";
  }else if (controllerMode == "button"){
    status = "{\"state\":\"" + String(int(state)) + "\", \"testState\":\"" + String(int(testState)) + "\", \"mode\":\"" + String(int(mode)) + "\", \"showStateOnLED\":\"" + String(int(showStateOnLED)) + "\"}";
  } else if (controllerMode == "hexagonz_lamp") {
    extern bool hexagonzLampState;
    extern int hexagonzLampBrightness;
    extern bool hexagonzBlinkingEnabled;
    extern int hexagonzBlinkRate;
    
    status = "{\"lampState\":\"" + String(int(hexagonzLampState)) + 
             "\", \"brightness\":\"" + String(hexagonzLampBrightness) + 
             "\", \"blinking\":\"" + String(int(hexagonzBlinkingEnabled)) + 
             "\", \"blinkRate\":\"" + String(hexagonzBlinkRate) + "\"}";
  } else {
    Serial.println("kein gültiger Modus");
  }
  
  answerJson = "{\"type\":" + String(messageType) + ", \"microcontrollerId\":" + ownID + ",\"key\":\"" + key + "\", \"answerCode\":\"" + answer + "\", \"state\":" + status + "}";

  snprintf (msg, MSG_BUFFER_SIZE, answerJson.c_str());
  Serial.print("Publish message: ");
  Serial.println(msg);
  client.publish(topic.c_str(), msg);
  
}

/*
Aufbau der JSONs welche auf dem Broker gepostet werden:
{type:1, target:"IDofTargetController", command:"commandToBeExecuted", brightness:"theBrightnessOffTheLamp", rgb:"RGBCode"}
{type:2, ID:"IDofCotrollerThatAnswers", Key:"keyOfTheControllerTheOneAlsoUsedForTheBroker" answerCode:"answer, f.e.: 'success'", state:{gesamte information des moduls, z.B.: brightness}}
{type:3, target:"IDofTargetController", state:{gesamte information des moduls, z.B.: brightness, welche übernommen werden sollen}}
evtl kann type:4 dann ein Sandkasten Befehl sein, welcher normalerweise mehr Parameter benötigt

Beispiel:
{type:1, target:4, command:"lampOn"}
//notiz: Befehle switchOn und switchOff einbauen, welche sowohl für button als auch für lamp funktionieren
bei button soll dann der innere status, welcher sagt ob die eingbaute lampe an ist, ein oder aus geschalten werden können
changeMode soll dann den modus des buttons ändern 
*/

// Methode welche die gepublishten JSONs verarbeiten kann
bool mqttJsonInterpretation(String mqttJsonSignal){
  bool success = true;
  int eepromStart = 0;
  String targetID="";
  String ownID="";
  String currentMode="";
  String command="";
  int type; // Nachrichtentyp, woran die Weiterverarbeitung entschieden wird
  int brightness;
  String rgb="";
  String sceneStatus="";
  String password="";

  // Die empfangene Nachricht wird als verarbeitbarer JSON gespeichert
  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, mqttJsonSignal);
  type = jsonDoc["type"];
  
  switch(type){
    //Die Nachricht ist ein Befehl
    case 1:
      // Überprüfen des Ziels des befehls
      targetID = String(String(jsonDoc["target"]).toInt() + 1); 
      ownID = readIDFromEEPROM(eepromStart);
      
      // Debug output to identify ID mismatch
      Serial.print("Target ID: ");
      Serial.println(targetID);
      Serial.print("Own ID: ");
      Serial.println(ownID);
      
      if(targetID == ownID){
        command = String(jsonDoc["command"]);
        if (command == "activateLamp"){
          writeModeToEEPROM(eepromStart, "lamp");
          controllerAnswer("Der Modus wurde geändert zu: lamp");
          ESP.restart(); 
        }else if(command == "changeLampBrightness"){
          currentMode = readModeFromEEPROM(eepromStart);
          if(currentMode == "lamp"){
            brightness = jsonDoc["brightness"];
            setBrightness(brightness);
          } else if(currentMode == "hexagonz_lamp"){
            brightness = jsonDoc["brightness"];
            setHexagonzLampBrightness(brightness);
          } else {
            controllerAnswer("der Modus des Controllers ist aktuell nicht: lamp oder hexagonz_lamp");
            Serial.println("der Modus des Controllers ist aktuell nicht: lamp oder hexagonz_lamp");
          }
        }else if(command == "changeRGBValue"){
          currentMode = readModeFromEEPROM(eepromStart);
          if(currentMode == "lamp"){
            rgb = String(jsonDoc["rgb"]);
            setHexColor(rgb);
          }else {
            controllerAnswer("der Modus des Controllers ist aktuell nicht: lamp");
            Serial.println("der Modus des Controllers ist aktuell nicht: lamp");
          }
        }else if (command == "switchOn"){
          currentMode = readModeFromEEPROM(eepromStart);
          Serial.print("Received switchOn command, current mode: ");
          Serial.println(currentMode);
          
          if (currentMode == "button"){
            switchButtonOn(); //bei button
          } else if (currentMode == "lamp"){
            switchLampOn();
          } else if (currentMode == "hexagonz_lamp"){
            Serial.println("Executing switchHexagonzLampOn...");
            switchHexagonzLampOn();
          } else {
            Serial.println("The controller mode does not match this command");
          }
        }else if (command == "switchOff"){
          currentMode = readModeFromEEPROM(eepromStart);
          if (currentMode == "button"){
            switchButtonOff(); //bei button
          } else if (currentMode == "lamp"){
            switchLampOff();
          } else if (currentMode == "hexagonz_lamp"){
            switchHexagonzLampOff();
          } else {
            Serial.println("Der Modus des Controllers passt nicht zu dem Befehl");
          }
        }else if (command == "changeMode"){
          currentMode = readModeFromEEPROM(eepromStart);
          if (currentMode == "button"){
            switchButtonMode();
          } else {
            Serial.println("Der Modus des Controllers passt nicht zu dem Befehl");
          }
        }else if(command == "activateButton"){
          writeModeToEEPROM(eepromStart, "button");
          controllerAnswer("Der Modus wurde geändert zu: button");
          ESP.restart();
        }else if(command == "activateHexagonzLamp"){
          writeModeToEEPROM(eepromStart, "hexagonz_lamp");
          controllerAnswer("Der Modus wurde geändert zu: hexagonz_lamp");
          ESP.restart();
        }else if (command == "blockProgramming"){
          currentMode = readModeFromEEPROM(eepromStart);
          if (currentMode == "hexagonz_lamp"){
            password = String(jsonDoc["password"]);
            blockProgramming(password);
          } else {
            Serial.println("Der Modus des Controllers passt nicht zu dem Befehl");
          }
        }else if (command == "openProgramming"){
          currentMode = readModeFromEEPROM(eepromStart);
          if (currentMode == "hexagonz_lamp"){
            password = String(jsonDoc["password"]);
            openProgramming(password);
          } else {
            Serial.println("Der Modus des Controllers passt nicht zu dem Befehl");
          }
        }else if (command == "setBlinking"){
          currentMode = readModeFromEEPROM(eepromStart);
          if (currentMode == "hexagonz_lamp"){
            bool shouldBlink = (jsonDoc["blinking"] == true || String(jsonDoc["blinking"]) == "1");
            int blinkRate = jsonDoc["blinkRate"] | 500; // Default to 500ms if not specified
            setHexagonzLampBlinking(shouldBlink, blinkRate);
          } else {
            Serial.println("Der Modus des Controllers passt nicht zu dem Befehl");
          }
        } else if (command == "clearMode"){
          writeModeToEEPROM(eepromStart, "noMode");
          controllerAnswer("Der Modus wurde geändert zu: noMode");
          ESP.restart();
        } else{
          Serial.println("kein gültiger Befehl");
          controllerAnswer("Der empfangene Befehl ist nicht gültig");
        }
      } else {
        Serial.println("message received but not for this controller");
      }
      break;
    // Die nachricht war eine Statusmeldung, daher braucht dieser Controller sie nicht zu verarbeiten
    case 2:
      Serial.println("message received but not a command");
      break;
    // Die Nachricht war der Befehl, eine Szene wieder herzustellen
    case 3:
      targetID = String(String(jsonDoc["target"]).toInt() + 1); 

      ownID = readIDFromEEPROM(eepromStart);
      
      // Fix: Convert both to integers for comparison here too
      if(targetID == ownID){
        sceneStatus = String(jsonDoc["state"]);
        DynamicJsonDocument jsonDocState(1024);
        deserializeJson(jsonDocState, sceneStatus);
        if (jsonDocState.containsKey("whiteFlag")){
          // Lampe stellt status wieder her
          lampScene(String(jsonDocState["whiteFlag"]), String(jsonDocState["red"]), String(jsonDocState["green"]), String(jsonDocState["blue"]), String(jsonDocState["brightness"]));
        } else if (jsonDocState.containsKey("lampState") && jsonDocState.containsKey("brightness")) {
          // Hexagonz Lampe stellt status wieder her
          String blinking = jsonDocState.containsKey("blinking") ? String(jsonDocState["blinking"]) : "0";
          String blinkRate = jsonDocState.containsKey("blinkRate") ? String(jsonDocState["blinkRate"]) : "500";
          hexagonzLampScene(String(jsonDocState["brightness"]), blinking, blinkRate);
        } else {
          // Button stellt status wieder her
          buttonScene(String(jsonDocState["state"]), String(jsonDocState["testState"]),String(jsonDocState["mode"]),String(jsonDocState["showStateOnLED"]));
        }
      } else {
        Serial.println("message received but not for this controller");
      }
      break;
    // Der typ existiert nicht
    default:
      Serial.println("invalid type of message");
      success = false;
  }
  return success;
}


void reconnect() {
  // Loop bis wir verbunden sind
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    // erstelle eine zufällige Client ID, da diese nicht relevant ist für den Broker
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Credentials um sich beim Broker anzumelden, welche im EEPROM liegen sollten
    mqttUsr = readIDFromEEPROM(eepromStart);
    mqttPw = readKeyFromEEPROM(eepromStart);

    Serial.print("ID: ");
    Serial.println(mqttUsr.c_str());
    Serial.print("key: ");
    Serial.println(mqttPw.c_str());

    topic = readTopicFromEEPROM(eepromStart);

    //muss noch angepasst werden
    if (client.connect(clientId.c_str(), mqttUsr.c_str(), mqttPw.c_str() )) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish(topic.c_str(), "hi");
      // ... and resubscribe
      client.subscribe(topic.c_str());
    } else {
      //gibt den Statuscode aus, falls die Verbindung fehlschlägt
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // warte 5 sekunden befor es erneut versucht wird
      delay(5000);
    }
  }
}
