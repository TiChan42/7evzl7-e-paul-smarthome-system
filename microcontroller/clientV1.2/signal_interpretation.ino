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

  // Die empfangene Nachricht wird als verarbeitbarer JSON gespeichert
  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, mqttJsonSignal);
  type = jsonDoc["type"];
  
  switch(type){
    //Die Nachricht ist ein Befehl
    case 1:
      // Überprüfen des Ziels des befehls
      targetID = String(jsonDoc["target"]);
      ownID = readIDFromEEPROM(eepromStart);
      if(targetID == ownID){
        command = String(jsonDoc["command"]);
        if (command == "activateLamp"){
          writeModeToEEPROM(eepromStart, "lamp");
          controllerAnswer("Der Modus wurde geändert zu: lamp");
          ESP.reset();
        }else if(command == "changeLampBrightness"){
          currentMode = readModeFromEEPROM(eepromStart);
          if(currentMode == "lamp"){
            brightness = jsonDoc["brightness"];
            setBrightness(brightness);
          } else {
            controllerAnswer("der Modus des Controllers ist aktuell nicht: lamp");
            Serial.println("der Modus des Controllers ist aktuell nicht: lamp");
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
          if (currentMode == "button"){
            switchButtonOn(); //bei button
          } else if (currentMode == "lamp"){
            switchLampOn();
          } else {
            Serial.println("The controller mode does not match this command");
          }
        }else if (command == "switchOff"){
          currentMode = readModeFromEEPROM(eepromStart);
          if (currentMode == "button"){
            switchButtonOff(); //bei button
          } else if (currentMode == "lamp"){
            switchLampOff();
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
          ESP.reset();
        } else if (command == "clearMode"){
          writeModeToEEPROM(eepromStart, "noMode");
          controllerAnswer("Der Modus wurde geändert zu: noMode");
          ESP.reset();
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
      targetID = String(jsonDoc["target"]);
      ownID = readIDFromEEPROM(eepromStart);
      if(targetID == ownID){
        sceneStatus = String(jsonDoc["state"]);
        DynamicJsonDocument jsonDocState(1024);
        deserializeJson(jsonDocState, sceneStatus);
        if (jsonDocState.containsKey("whiteFlag")){
          // Lampe stellt status wieder her
          lampScene(String(jsonDocState["whiteFlag"]), String(jsonDocState["red"]), String(jsonDocState["green"]), String(jsonDocState["blue"]), String(jsonDocState["brightness"]));
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