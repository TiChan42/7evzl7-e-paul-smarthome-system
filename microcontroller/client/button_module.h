#ifndef BUTTON_MODULE_H
#define BUTTON_MODULE_H

// Function declarations for button module
void checkButton();
void writeLED(bool ledState);
void setButtonMode();
void setLatchMode();
void switchButtonOff();
void switchButtonOn();
void setShowState();
void removeShowState();
void sendCurrentMode();
void sendButtonPressed();
void sendButtonReleased();
void switchButtonMode();
void buttonScene(String sceneState, String sceneTestState, String sceneMode, String sceneShowStateOnLED);

#endif // BUTTON_MODULE_H
