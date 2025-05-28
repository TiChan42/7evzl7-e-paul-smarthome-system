#ifndef FIRST_CONNECTION_H
#define FIRST_CONNECTION_H

#include <Arduino.h>

// Function declarations for first connection setup
void setUpWiFiAccessPoint();
void handleGET();
void answerWebClientRequest(String answer);
void getConnectionStrengthNumber(String &htmlString, int strength, int viewSize = 5, int min = -120, int max = -40);
void tryToSetupViaWebserver();

#endif // FIRST_CONNECTION_H
