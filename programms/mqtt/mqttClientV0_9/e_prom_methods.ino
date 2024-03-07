#include <EEPROM.h>
/*
Der Aufbau der EEPROM ist folgender:
---------------------------------------------------------------------------------
SSID\0Password\0Topic\0ID\0Key\0Mode
---------------------------------------------------------------------------------
*/

// Funktion zum Schreiben der SSID in den EEPROM
void writeSSIDToEEPROM(int address, String data) {
  EEPROM.begin(data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(address + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(address + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Schreiben des Passworts nach der SSID in den EEPROM
void writePasswordToEEPROM(int address, String data) {
  int passwordStart = readSSIDFromEEPROM(address).length() + 1; //ab hier beginnt das Passwort
  
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
  int topicStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + 2; //ab hier beginnt das Topic
  
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
  int idStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + 3; //ab hier beginnt die id
  
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
  int keyStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + 4; //ab hier beginnt der key
  
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
  int modeStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + readKeyFromEEPROM(address).length() + 5; //ab hier beginnt der modus
  
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
    character = EEPROM.read(address + i);
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

  int passwordStart = readSSIDFromEEPROM(address).length() + 1; //ab hier beginnt das Passwort
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

  int topicStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + 2; //ab hier beginnt das Topic
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

  int idStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + 3; //ab hier beginnt die ID
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

  int keyStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + 4; //ab hier beginnt der Key
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

  int modeStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + readKeyFromEEPROM(address).length() + 5; //ab hier beginnt der Modus
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