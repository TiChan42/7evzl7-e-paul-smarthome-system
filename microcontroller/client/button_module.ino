#include <Arduino.h>
#include "button_module.h"
#include "mqtt_utils.h"

// Importieren einer Methode
void controllerAnswer(String answer);

//Überprüft den Knopf und führt bei Änderung die dem Modus entsprechende Aktion aus
void checkButton() {
  bool actualButtonstate = digitalRead(BUTTON);
  if (actualButtonstate != testState) {
    testState = actualButtonstate;
    //Button: ändert State je nach ist-Wert
    if (mode) {
      state = !actualButtonstate;
      writeLED(state);
      if (state) sendButtonPressed();
      else sendButtonReleased();
    }

    //Latch: ändert State bei positiver Flanke
    else if (!actualButtonstate) {
      state = !state;
      writeLED(state);
      if (state) sendButtonPressed();
      else sendButtonReleased();
    }
    delay(100);  // Entprellung überspringen
  }
}

// Schreibt die LED auf ledState wenn der Status über Led angezeigt werden soll
void writeLED(bool ledState) {
  if (showStateOnLED) {
    digitalWrite(ONBOARD_LED, !ledState);
  }
}

// Resettet den Status des Moduls und setzt den Knopf-Modus
void setButtonMode() {
  mode = 1;
  state = 0;
  testState = 1;
}

// Resettet den Status des Moduls und setzt den Schalter-Modus
void setLatchMode() {
  mode = 0;
  state = 0;
  testState = 1;
}

void switchButtonOff() {
  state = 0;
  controllerAnswer("Der Knopf wurde ausgeschalten");
}

void switchButtonOn() {
  state = 1;
  controllerAnswer("Der Knopf wurde eingeschalten");
}

//Setzt die Flag dass der Status des Schalters an der LED angezeigt werden soll
void setShowState() {
  showStateOnLED = 1;
}

//Setzt die Flag zurrück, dass der Status des Schalters an der LED angezeigt werden soll
void removeShowState() {
  showStateOnLED = 0;
}

// Noch nicht implementiert/ist das überhaupt notwendig???????????????????????????????????????????????
//Sendet Aktuellen Modus
void sendCurrentMode() {
  if (mode) {
    //Button Mode
  } else {
    //Latch Mode
  }
}

// Sendet, dass der Status auf gedrückt gesetzt wurde
void sendButtonPressed() {
  controllerAnswer("Der Knopf wurde gedrückt");
  Serial.println("Der Knopf wurde gedrückt!");
}

// Sendet, dass der Status auf losgelassen gesetzt wurde
void sendButtonReleased() {
  controllerAnswer("Der Knopf wurde logelassen");
  Serial.println("Der Knopf wurde losgelassen!");
}

void switchButtonMode() {
  if (mode) setLatchMode();
  else setButtonMode();
  controllerAnswer("Der Modus des Knopfs wurde geändert");
}

void buttonScene(String sceneState, String sceneTestState, String sceneMode, String sceneShowStateOnLED) {
  state = sceneState.toInt();
  testState = sceneTestState.toInt();
  mode = sceneMode.toInt();
  showStateOnLED = sceneShowStateOnLED.toInt();
  controllerAnswer("Szene geändert");
}