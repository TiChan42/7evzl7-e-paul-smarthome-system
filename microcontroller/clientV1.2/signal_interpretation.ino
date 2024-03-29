
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

//methode welche die gepublishten jsons verarbeiten kann
bool mqttJsonInterpretation(String mqttJsonSignal){

  //war die Methode erfolgreich?
  bool success = true;
  //die eeprom methoden brauchen immer einen Startpunkt
  int eepromStart = 0;

  //die Id, die als Ziel der Befehle gilt
  String targetID="";
  //die eigene ID des Controllers
  String ownID="";
  //der Modus in dem sich der Controller aktuell befindet also lamp oder button
  String currentMode="";
  //der eventuell empfangene Befehl
  String command="";
  //der Typ der Nachricht, daran wird entschieden wie er weiter verarbeitet wird
  int type;

  //die helligkeit der Lampe im Befehl
  int brightness;
  //der rgb Wert im Befehl
  String rgb="";

  //der status der übernommen werden soll
  String sceneStatus="";

  //die empfangene Nachricht wird als verarbeitbarer json gespeichert
  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, mqttJsonSignal);
  type = jsonDoc["type"];
  
  //anhand des typs der Nachricht wird entschieden was gemacht werden soll
  switch(type){
    //Die Nachricht ist ein Befehl
    case 1:
      //ist der BEfehl an diesen controller gerichtet
      targetID = String(jsonDoc["target"]);
      ownID = readIDFromEEPROM(eepromStart);
      if(targetID == ownID){
        //der entsprechende command wird ausgeführt
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
    //die nachricht war eine Statusmeldung, daher braucht dieser controller sie nicht zu verarbeiten
    case 2:
      Serial.println("message received but not a command");
      break;
    //die Nachricht war der Befehl eine szene wieder herzustellen
    case 3:
      targetID = String(jsonDoc["target"]);
      ownID = readIDFromEEPROM(eepromStart);
      if(targetID == ownID){
        sceneStatus = String(jsonDoc["state"]);
        DynamicJsonDocument jsonDocState(1024);
        deserializeJson(jsonDocState, sceneStatus);
        if (jsonDocState.containsKey("whiteFlag")){
          //lampe stellt status wieder her
          lampScene(String(jsonDocState["whiteFlag"]), String(jsonDocState["red"]), String(jsonDocState["green"]), String(jsonDocState["blue"]), String(jsonDocState["brightness"]));
        } else {
          //button stellt status wieder her
          buttonScene(String(jsonDocState["state"]), String(jsonDocState["testState"]),String(jsonDocState["mode"]),String(jsonDocState["showStateOnLED"]));
        }


        
      } else {
        Serial.println("message received but not for this controller");
      }
      
      break;
    //der typ existiert nicht
    default:
      Serial.println("invalid type of message");
      success = false;

  }
  



  return success;
}








