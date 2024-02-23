#include <EEPROM.h>


// Funktion zum Schreiben eines Strings in den EEPROM
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