#ifndef EEPROM_UTILS_H
#define EEPROM_UTILS_H

// EEPROM utility functions

// Clear and initialization functions
void clearEEPROM();

// Write functions
void writeResetCounterToEEPROM(String data);
void writeSSIDToEEPROM(int address, String data);
void writePasswordToEEPROM(int address, String data);
void writeTopicToEEPROM(int address, String data);
void writeIDToEEPROM(int address, String data);
void writeKeyToEEPROM(int address, String data);
void writeModeToEEPROM(int address, String data);

// Read functions
void readAll();
char readResetCounterFromEEPROM();
String readSSIDFromEEPROM(int address);
String readPasswordFromEEPROM(int address);
String readTopicFromEEPROM(int address);
String readIDFromEEPROM(int address);
String readKeyFromEEPROM(int address);
String readModeFromEEPROM(int address);

#endif // EEPROM_UTILS_H
