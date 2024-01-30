#include <EEPROM.h>

void setup() {
  Serial.begin(115200);

  for (int i = 0 ; i < 20; i++) {
  Serial.println(".");
  delay(500);
  }

  // Lese den String aus dem EEPROM
  String readString = readStringFromEEPROM(0);

  // Ausgabe des gelesenen Strings
  Serial.println("Gespeicherter String:");
  Serial.println(readString);

  // String zum Schreiben in den EEPROM
  String myString = "Das ist ein Test";

  // Schreibe den String in den EEPROM
  //writeStringToEEPROM(0, myString);
}

void loop() {
  // Ihr Hauptcode hier
}

// Funktion zum Schreiben eines Strings in den EEPROM
void writeStringToEEPROM(int address, String data) {
  EEPROM.begin(data.length() + 1); // Reserviere Speicherplatz im EEPROM für den String
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(address + i, data[i]); // Schreibe jedes Zeichen des Strings in den EEPROM
  }
  EEPROM.write(address + data.length(), '\0'); // Nullterminierung hinzufügen
  EEPROM.commit(); // Speichern Sie die Daten im EEPROM
  EEPROM.end(); // Beenden Sie die Verwendung des EEPROM
}

// Funktion zum Lesen eines Strings aus dem EEPROM
String readStringFromEEPROM(int address) {
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
