#include <EEPROM.h>
#include <ESP8266WiFi.h>




void clearEEPROM() {
  EEPROM.begin(512); // Größe des EEPROM-Speichers
  for (int i = 0; i < EEPROM.length(); ++i) {
    EEPROM.write(i, 0); // Schreibe 0 an jede Speicheradresse
  }
  EEPROM.commit(); // Speichert die Änderungen
  EEPROM.end(); // Beendet die EEPROM-Benutzung
}