#include <EEPROM.h>
#include <ESP8266WiFi.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("Clearing EEPROM...");
  clearEEPROM();
  
  Serial.println("Done! EEPROM Cleared.");
}

void loop() {
  // Dieser Code wird nicht benötigt, da wir nur einmalig die EEPROM-Daten löschen
}

void clearEEPROM() {
  EEPROM.begin(512); // Größe des EEPROM-Speichers
  for (int i = 0; i < EEPROM.length(); ++i) {
    EEPROM.write(i, 0); // Schreibe 0 an jede Speicheradresse
  }
  EEPROM.commit(); // Speichert die Änderungen
  EEPROM.end(); // Beendet die EEPROM-Benutzung
}
