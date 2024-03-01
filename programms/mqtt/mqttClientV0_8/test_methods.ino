void mqttChangeBrightness(){
  
  int eepromStart = 0;
  int messageType = 1;
  String topic = ""; 
  String ownID = "";
  String answerJson = "";
  String command = "changeLampBrightness";

  topic = readTopicFromEEPROM(eepromStart);
  ownID = readIDFromEEPROM(eepromStart);

  answerJson = "{type:" + String(messageType) + ", target:" + ownID + ", command:\"" + command + "\", brightness:10}";
  //command == "changeLampBrightness"
  //{type:2, ID:"IDofCotrollerThatAnswers", answerCode:"answer, f.e.: "success"}
  snprintf (msg, MSG_BUFFER_SIZE, answerJson.c_str());
  Serial.print("Publish message: ");
  Serial.println(msg);
  client.publish(topic.c_str(), msg);
}

void mqttChangeColor(){
  
  int eepromStart = 0;
  int messageType = 1;
  String topic = ""; 
  String ownID = "";
  String answerJson = "";
  String command = "changeRGBValue";

  topic = readTopicFromEEPROM(eepromStart);
  ownID = readIDFromEEPROM(eepromStart);

  answerJson = "{type:" + String(messageType) + ", target:" + ownID + ", command:\"" + command + "\", rgb:\"#0000FF\"}";
  //command == "changeLampBrightness"
  //{type:2, ID:"IDofCotrollerThatAnswers", answerCode:"answer, f.e.: "success"}
  snprintf (msg, MSG_BUFFER_SIZE, answerJson.c_str());
  Serial.print("Publish message: ");
  Serial.println(msg);
  client.publish(topic.c_str(), msg);
}