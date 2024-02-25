//@Timo du kannst deine fertigen methoden zum einschalten von lampen, etc in die commandInterpretation() integrieren
/*
Aufbau der JSONs welche auf dem Broker gepostet werden:
{type:1, target:"IDofTargetController", command:"commandToBeExecuted"}
{type:2, ID:"IDofCotrollerThatAnswers", answerCode:"answer, f.e.: success"}
evtl kann type:3 dann ein Sandkasten Befehl sein, welcher normalerweise mehr Parameter benötigt

Beispiel:
{type:1, target:4, command:"lampOn"}
*/

//methode welche die vorgefertigten Methoden ausführt
bool commandInterpretation(String command){
  bool success = true;

  if(command == "lampOn"){
    //methode die die lampe einschalted
    Serial.println("die lampe geht an!");
  } else if (command == "lampOff"){
    //methode die die Lampe ausschaltet
    Serial.println("die lampe geht aus!");
  } else {
    success = false;
  }

  return success;  
}

//methode welche die gepublishten jsons verarbeiten kann
bool mqttJsonInterpretation(String mqttJsonSignal){
  
  bool success = true;
  int eepromStart = 0;

  String targetID;
  String ownID;
  String command;
  int type;

  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, mqttJsonSignal);
  type = jsonDoc["type"];
  
  switch(type){
    case 1:
      targetID = String(jsonDoc["target"]);
      ownID = readIDFromEEPROM(eepromStart);
      if(targetID == ownID){
        command = String(jsonDoc["command"]);
        if(commandInterpretation(command) == false){
          success = false;
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








