#include <EEPROM.h>
#include <eeprom_utils.h>

/*
Aufbau des EEPROM-Speichers:
---------------------------------------------------------------------------------
ResetCounter\1SSID\0Password\0Topic\0ID\0Key\0Mode\0
---------------------------------------------------------------------------------
*/

#define EEPROM_SIZE 512

// Methode, um den EEPROM-Speicher mit unbenutzbaren Werten zu überschreiben
void clearEEPROM () {
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < EEPROM_SIZE; i++) {
    EEPROM.write(i, '\3');
  }
  EEPROM.commit();
  EEPROM.end();
}

//Write-Methoden
// Funktion zum Schreiben des Modus nach dem Reset-Counters in den EEPROM
void writeResetCounterToEEPROM(String data) {  
  EEPROM.begin(EEPROM_SIZE);
  EEPROM.write(0, data[0]); // Schreibe jedes Zeichen des Strings in den EEPROM
  EEPROM.write(1, '\1'); // Terminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}

// Funktion zum Schreiben der SSID in den EEPROM
void writeSSIDToEEPROM(int address, String data) {
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(address + i + 2, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(address + data.length() + 2, '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}

// Funktion zum Schreiben des Passworts in den EEPROM
void writePasswordToEEPROM(int address, String data) {
  int passwordStart = readSSIDFromEEPROM(address).length() + 3;
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(passwordStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(passwordStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}

// Funktion zum Schreiben des Topics in den EEPROM
void writeTopicToEEPROM(int address, String data) {
  int topicStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + 4;
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(topicStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(topicStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}

// Funktion zum Schreiben der ID in den EEPROM
void writeIDToEEPROM(int address, String data) {
  int idStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + 5;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(idStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(idStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}

// Funktion zum Schreiben des Keys in den EEPROM
void writeKeyToEEPROM(int address, String data) {
  int keyStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + 6;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(keyStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(keyStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}

// Funktion zum Schreiben des Modus in den EEPROM
void writeModeToEEPROM(int address, String data) {
  int modeStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + readKeyFromEEPROM(address).length() + 7;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(modeStart + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(modeStart + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern der Daten im EEPROM
  EEPROM.end(); // Beenden der EEPROM-Verwendung
}


//Read-Methoden
// Methode, um den gesamten EEPROM auszulesen, hauptsächlich zum debuggen
void readAll() {
  EEPROM.begin(512);
  char character;
  // i<80 notfalls anpassen
  for (int i = 0; i<80; i++) { 
    character = EEPROM.read(i);
    Serial.print(character);
  }
}

// Funktion zum Lesen des Reset Counters aus dem EEPROM
char readResetCounterFromEEPROM() {
  EEPROM.begin(EEPROM_SIZE);
  char character = EEPROM.read(0);
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return character;
}

// Funktion zum Lesen der SSID aus dem EEPROM
String readSSIDFromEEPROM(int address) {
  String characters;
  char character;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < 100; i++) { // Lesen von maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(address + i + 2);
    if (character == '\0') { // Abbruch bei Erreichen des Nullterminierungszeichens
      break;
    }
    characters += character; // Hinzufügen des Zeichens zum String
  }
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return characters;
}

// Funktion zum Lesen des Passworts aus dem EEPROM
String readPasswordFromEEPROM(int address) {
  String characters;
  char character;
  int passwordStart = readSSIDFromEEPROM(address).length() + 3;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < 100; i++) { // Lesen von maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(passwordStart + i);
    if (character == '\0') { // Abbruch bei Erreichen des Nullterminierungszeichens
      break;
    }
    characters += character; // Hinzufügen des Zeichens zum String
  }
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return characters;
}

// Funktion zum Lesen des Topics aus dem EEPROM
String readTopicFromEEPROM(int address) {
  String characters;
  char character;
  int topicStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + 4;
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < 100; i++) { // Lesen von maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(topicStart + i);
    if (character == '\0') { // Abbruch bei Erreichen des Nullterminierungszeichens
      break;
    }
    characters += character; // Hinzufügen des Zeichens zum String
  }
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return characters;
}

// Funktion zum Lesen der ID aus dem EEPROM
String readIDFromEEPROM(int address) {
  String characters;
  char character;
  int idStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + 5;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < 100; i++) { // Lesen von maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(idStart + i);
    if (character == '\0') { // Abbruch bei Erreichen des Nullterminierungszeichens
      break;
    }
    characters += character; // Hinzufügen des Zeichens zum String
  }
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return characters;
}

// Funktion zum Lesen des Keys aus dem EEPROM
String readKeyFromEEPROM(int address) {
  String characters;
  char character;
  int keyStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + 6;
  EEPROM.begin(EEPROM_SIZE); 
  for (int i = 0; i < 100; i++) { // Lesen von maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(keyStart + i);
    if (character == '\0') { // Abbruch bei Erreichen des Nullterminierungszeichens
      break;
    }
    characters += character; // Hinzufügen des Zeichens zum String
  }
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return characters;
}

// Funktion zum Lesen des Modus aus dem EEPROM
String readModeFromEEPROM(int address) {
  String characters;
  char character;
  int modeStart = readSSIDFromEEPROM(address).length() + readPasswordFromEEPROM(address).length() + readTopicFromEEPROM(address).length() + readIDFromEEPROM(address).length() + readKeyFromEEPROM(address).length() + 7;
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < 100; i++) { // Lesen von maximal 100 Zeichen aus dem EEPROM
    character = EEPROM.read(modeStart + i);
    if (character == '\0') { // Abbruch bei Erreichen des Nullterminierungszeichens
      break;
    }
    characters += character; // Hinzufügen des Zeichens zum String
  }
  EEPROM.end(); // Beenden der EEPROM-Verwendung
  return characters;
}