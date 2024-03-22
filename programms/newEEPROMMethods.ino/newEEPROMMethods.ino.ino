#include <EEPROM.h>

void setup() {
  Serial.begin(9600);
  //delay(50);
  /*writeResetCounterToEEPROM("0");
  writeSSIDToEEPROM(0, "TEst0SSID");
  writePasswordToEEPROM(0, "TEstPW");
  writeTopicToEEPROM(0, "TEstTopic");
  writeIDToEEPROM(0, "TEstID");
  writeKeyToEEPROM(0, "TEstKey");
  writeModeToEEPROM(0, "TEstMode");*/

  readAll();

  /*Serial.println("");
  Serial.println(readResetCounterFromEEPROM());
  Serial.println(readSSIDFromEEPROM(0));
  Serial.println(readPasswordFromEEPROM(0));
  Serial.println(readTopicFromEEPROM(0));
  Serial.println(readIDFromEEPROM(0));
  Serial.println(readKeyFromEEPROM(0));
  Serial.println(readModeFromEEPROM(0));
  Serial.println("");*/

  char rst = readResetCounterFromEEPROM();
  Serial.print("Reset Counter: ");
  Serial.print(rst);
  if (rst == '0') {
    rst = '1';
    writeResetCounterToEEPROM((String)rst);
  } else if (rst == '1') {
    rst = '2';
    writeResetCounterToEEPROM((String)rst);
  } else { //if (rst == '2') {
    Serial.println("Clearen");
    clearEEPROM();
    writeResetCounterToEEPROM("0");
    ESP.reset();
  }
  Serial.println(readResetCounterFromEEPROM());

  delay(1000);
  writeResetCounterToEEPROM("0");
  Serial.println(readResetCounterFromEEPROM());

  readAll();

}

void loop() {
  // put your main code here, to run repeatedly:

}

void clearEEPROM () {
  EEPROM.begin(512);
  for (int i = 0; i < 512; i++) {
    EEPROM.write(i, '\3');
  }
  EEPROM.commit();
  EEPROM.end();
}

void readAll() {
  EEPROM.begin(512);
  char character;
  for (int i = 0; i<80; i++) {
    character = EEPROM.read(i);
    Serial.print(character);
  }

}
/*
Der Aufbau der EEPROM ist folgender:
---------------------------------------------------------------------------------
SSID\0Password\0Topic\0ID\0Key\0Mode\1ResetCounter\2
---------------------------------------------------------------------------------
*/

// Funktion zum Schreiben des modus nach der SSID, des Passworts, des Topics, der ID und des Key in den EEPROM
void writeResetCounterToEEPROM(String data) {  
  EEPROM.begin(512);
  Serial.print("Writing ");
  Serial.print(data[0]);
  Serial.print(" to eeprom");
  Serial.println("");
  EEPROM.write(0, data[0]); // Schreibe jedes Zeichen des Strings in den EEPROM
  
  EEPROM.write(1, '\1'); // Terminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben der SSID in den EEPROM
void writeSSIDToEEPROM(int address, String data) {
  EEPROM.begin(data.length() + 1 + 2); // Reserviere Speicherplatz im EEPROM für den String
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(address + i + 2, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(address + data.length() + 2, '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben des Passworts nach der SSID in den EEPROM
void writePasswordToEEPROM(int address, String data) {
  int passwordStart = readSSIDFromEEPROM(address).length() + 1 + 2; //ab hier beginnt das Passwort
  
  EEPROM.begin(passwordStart + data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String

  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(passwordStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(passwordStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben des Topics nach der SSID und des Passworts in den EEPROM
void writeTopicToEEPROM(int address, String data) {
  int topicStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + 2 + 2; //ab hier beginnt das Topic
  
  EEPROM.begin(topicStart + data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String

  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(topicStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(topicStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben der ID nach der SSID, des Passworts und des Topics in den EEPROM
void writeIDToEEPROM(int address, String data) {
  int idStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + 3 + 2; //ab hier beginnt die id
  
  EEPROM.begin(idStart + data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String

  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(idStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(idStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben des Key nach der SSID, des Passworts, des Topics und der ID in den EEPROM
void writeKeyToEEPROM(int address, String data) {
  int keyStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + 4 + 2; //ab hier beginnt der key
  
  EEPROM.begin(keyStart + data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String

  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(keyStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(keyStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben des modus nach der SSID, des Passworts, des Topics, der ID und des Key in den EEPROM
void writeModeToEEPROM(int address, String data) {
  int modeStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + readKeyFromEEPROM(address).length() + 5 + 2; //ab hier beginnt der modus
  
  EEPROM.begin(modeStart + data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String

  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(modeStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(modeStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}





// Funktion zum Lesen eines Strings aus dem EEPROM
String readSSIDFromEEPROM(int address) {
  String characters;
  char character;
  EEPROM.begin(512); // Beginne die Verwendung des EEPROM
  for (int i = 0; i < 100; i++) { // Lesen Sie maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(address + i + 2);
    if (character == '\0') { // Wenn das Nullterminierungszeichen erreicht ist, brechen Sie ab
      break;
    }
    characters += character; // Fügen Sie das Zeichen zum String hinzu
  }
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return characters;
}

// Funktion zum Lesen des Passworts nach der SSID in den EEPROM
String readPasswordFromEEPROM(int address) {
  String characters;
  char character;

  int passwordStart = readSSIDFromEEPROM(address).length() + 1 + 2; //ab hier beginnt das Passwort
  EEPROM.begin(512); // Beginne die Verwendung des EEPROM

  for (int i = 0; i < 100; i++) { // Lesen Sie maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(passwordStart + i);
    if (character == '\0') { // Wenn das Nullterminierungszeichen erreicht ist, brechen Sie ab
      break;
    }
    characters += character; // Fügen Sie das Zeichen zum String hinzu
  }
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return characters;
}


// Funktion zum Lesen des Topics nach der SSID und des Passorts in den EEPROM
String readTopicFromEEPROM(int address) {
  String characters;
  char character;

  int topicStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + 2 + 2; //ab hier beginnt das Topic
  EEPROM.begin(512); // Beginne die Verwendung des EEPROM

  for (int i = 0; i < 100; i++) { // Lesen Sie maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(topicStart + i);
    if (character == '\0') { // Wenn das Nullterminierungszeichen erreicht ist, brechen Sie ab
      break;
    }
    characters += character; // Fügen Sie das Zeichen zum String hinzu
  }
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return characters;
}

// Funktion zum Lesen der ID nach der SSID, des Passworts und des Topics in den EEPROM
String readIDFromEEPROM(int address) {
  String characters;
  char character;

  int idStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + 3 + 2; //ab hier beginnt die ID
  EEPROM.begin(512); // Beginne die Verwendung des EEPROM

  for (int i = 0; i < 100; i++) { // Lesen Sie maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(idStart + i);
    if (character == '\0') { // Wenn das Nullterminierungszeichen erreicht ist, brechen Sie ab
      break;
    }
    characters += character; // Fügen Sie das Zeichen zum String hinzu
  }
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return characters;
}

// Funktion zum Lesen des key nach der SSID, des Passworts, des Topics und der ID in den EEPROM
String readKeyFromEEPROM(int address) {
  String characters;
  char character;

  int keyStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + 4 + 2; //ab hier beginnt der Key
  EEPROM.begin(512); // Beginne die Verwendung des EEPROM

  for (int i = 0; i < 100; i++) { // Lesen Sie maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(keyStart + i);
    if (character == '\0') { // Wenn das Nullterminierungszeichen erreicht ist, brechen Sie ab
      break;
    }
    characters += character; // Fügen Sie das Zeichen zum String hinzu
  }
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return characters;
}

// Funktion zum Lesen des modus nach der SSID, des Passworts, des Topics, der ID und des key in den EEPROM
String readModeFromEEPROM(int address) {
  String characters;
  char character;

  int modeStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + readKeyFromEEPROM(address).length() + 5 + 2; //ab hier beginnt der Modus
  EEPROM.begin(512); // Beginne die Verwendung des EEPROM

  for (int i = 0; i < 100; i++) { // Lesen Sie maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(modeStart + i);
    if (character == '\0') { // Wenn das Nullterminierungszeichen erreicht ist, brechen Sie ab
      break;
    }
    characters += character; // Fügen Sie das Zeichen zum String hinzu
  }
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return characters;
}

// Funktion zum Lesen des modus nach der SSID, des Passworts, des Topics, der ID und des key in den EEPROM
char readResetCounterFromEEPROM() {

  EEPROM.begin(512); // Beginne die Verwendung des EEPROM
  char character = EEPROM.read(0);
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
  return character;
}