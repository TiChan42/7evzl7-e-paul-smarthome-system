void controllerAnswer(String answer){

  int eepromStart = 0;
  int messageType = 2;
  String topic = ""; 
  String ownID = "";
  String answerJson = "";

  topic = readTopicFromEEPROM(eepromStart);
  ownID = readIDFromEEPROM(eepromStart);

  answerJson = "{type:" + String(messageType) + ", ID:" + ownID + ", answerCode:\"" + answer + "\"}";

  //{type:2, ID:"IDofCotrollerThatAnswers", answerCode:"answer, f.e.: "success"}
  snprintf (msg, MSG_BUFFER_SIZE, answerJson.c_str());
  Serial.print("Publish message: ");
  Serial.println(msg);
  client.publish(topic.c_str(), msg);
  
}