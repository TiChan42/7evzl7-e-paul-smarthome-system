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

  //Bauen des Status abhängig davon in welchem modus sich der Controller befindet
  if(controllerMode == "lamp"){
    status = "{\"whiteFlag\":\"" + String(int(white_flag)) + "\", \"red\":\"" + String(int(global_red)) + "\", \"green\":\"" + String(int(global_green)) + "\", \"blue\":\"" + String(int(global_blue)) + "\", \"brightness\":\"" + String(int(global_brightness)) + "\"}";
  }else if (controllerMode == "button"){
    status = "{\"state\":\"" + String(int(state)) + "\", \"testState\":\"" + String(int(testState)) + "\", \"mode\":\"" + String(int(mode)) + "\", \"showStateOnLED\":\"" + String(int(showStateOnLED)) + "\"}";
  } else {
    Serial.println("kein gültiger Modus");
  }



  answerJson = "{\"type\":" + String(messageType) + ", \"microcontrollerId\":" + ownID + ",\"key\":\"" + key + "\", \"answerCode\":\"" + answer + "\", \"state\":" + status + "}";

  snprintf (msg, MSG_BUFFER_SIZE, answerJson.c_str());
  Serial.print("Publish message: ");
  Serial.println(msg);
  client.publish(topic.c_str(), msg);
  
}