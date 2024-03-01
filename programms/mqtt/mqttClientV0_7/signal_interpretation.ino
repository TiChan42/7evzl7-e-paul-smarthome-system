//@Timo du kannst deine fertigen methoden zum einschalten von lampen, etc in die commandInterpretation() integrieren
/*
Aufbau der JSONs welche auf dem Broker gepostet werden:
{type:1, target:"IDofTargetController", command:"commandToBeExecuted", brightness:"theBrightnessOffTheLamp", rgb:"RGBCode"}
{type:2, ID:"IDofCotrollerThatAnswers", answerCode:"answer, f.e.: "success"}
evtl kann type:3 dann ein Sandkasten Befehl sein, welcher normalerweise mehr Parameter benötigt

Beispiel:
{type:1, target:4, command:"lampOn"}
*/

//methode welche die gepublishten jsons verarbeiten kann
bool mqttJsonInterpretation(String mqttJsonSignal){
  
  bool success = true;
  int eepromStart = 0;

  String targetID="";
  String ownID="";
  String currentMode="";
  String command="";
  int type;

  int brightness;
  String rgb="";


  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, mqttJsonSignal);
  type = jsonDoc["type"];
  
  switch(type){
    case 1:
      targetID = String(jsonDoc["target"]);
      Serial.println(targetID);
      ownID = readIDFromEEPROM(eepromStart);
      Serial.println(ownID);
      if(targetID == ownID){
        command = String(jsonDoc["command"]);
        /*
        if(commandInterpretation(command) == false){
          success = false;
        }
        */
        if (command == "activateLamp"){
          writeModeToEEPROM(eepromStart, "lamp");
          controllerAnswer("Der Modus wurde geändert zu: lamp");
          ESP.reset();
        }else if(command == "changeLampBrightness"){
          currentMode = readModeFromEEPROM(eepromStart);
          if(currentMode == "lamp"){
            brightness = jsonDoc["brightness"];
            changeBrightness(brightness);

          } else {
            controllerAnswer("der Modus des Controllers ist aktuell nicht: lamp");
            Serial.println("der Modus des Controllers ist aktuell nicht: lamp");
          }
        }else if(command == "changeLampBrightness"){
        currentMode = readModeFromEEPROM(eepromStart);
        if(currentMode == "lamp"){
          rgb = String(jsonDoc["rgb"]);
          setHexColor(rgb);
          

        }else {
          controllerAnswer("der Modus des Controllers ist aktuell nicht: lamp");
          Serial.println("der Modus des Controllers ist aktuell nicht: lamp");
        }

        }else if(command == "changeRGBValue"){
          currentMode = readModeFromEEPROM(eepromStart);
          if(currentMode == "lamp"){
            rgb = String(jsonDoc["rgb"]);
            //@timos methode zum ändern der Farbe

          } else {
            controllerAnswer("der Modus des Controllers ist aktuell nicht: Lampe");
            Serial.println("der Modus des Controllers ist aktuell nicht: Lampe");
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
          //HIER: statusmeldung schicken
        }
      } else {
        Serial.println("message received but not for this controller");
      }
      break;
    case 2:
      Serial.println("message received but not a command");
      break;
    case 3:
      //sandbox sachen, WIP
      break;
    default:
      Serial.println("invalid type of message");
      success = false;

  }
  



  return success;
}








