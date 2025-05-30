#ifndef HEXAGONZ_MODULE_H
#define HEXAGONZ_MODULE_H

#include <Arduino.h>

// Initialize hexagonz module
void initHexagonzModule();

// Light control functions
void switchHexagonzLampOn();
void switchHexagonzLampOff();
void setHexagonzLampBrightness(int brightness);
// Info LED control
void setInfoLedOn();
void setInfoLedOff();
void toggleInfoLed();
bool getInfoLedState();
void toggleLampState();

// Button handling
void checkHexagonzButton();

// Programming control with password protection
bool blockProgramming(String password);
bool openProgramming(String password);

// Scene recreation
void hexagonzLampScene(String brightness);

#endif // HEXAGONZ_MODULE_H
