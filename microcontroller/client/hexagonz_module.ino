#include <Arduino.h>
#include "hexagonz_module.h"
#include "mqtt_utils.h"
#include "eeprom_utils.h"

// Pin definitions (already defined in client.ino but redefined here for clarity)
#define HEXAGONZ_INFO_LED 23
#define HEXAGONZ_BUTTON 22
#define HEXAGONZ_WHITE_LIGHT 21

// Global variables
bool hexagonzLampState = false;
int hexagonzLampBrightness = 100;
bool hexagonzBlinkingEnabled = false;
int hexagonzBlinkRate = 500;
unsigned long lastBlinkTime = 0;
bool blinkState = false;
bool buttonPressed = false;
unsigned long lastButtonDebounceTime = 0;
unsigned long debounceDelay = 50;
const String defaultProgrammingPassword = "hexagonz123"; // Default password
bool previousInfoLedState = false; // Store previous LED state

// Initialize the hexagonz module
void initHexagonzModule() {
  pinMode(HEXAGONZ_INFO_LED, OUTPUT);
  pinMode(HEXAGONZ_BUTTON, INPUT_PULLUP);
  pinMode(HEXAGONZ_WHITE_LIGHT, OUTPUT);
  
  // Initialize states
  digitalWrite(HEXAGONZ_INFO_LED, HIGH);
  digitalWrite(HEXAGONZ_WHITE_LIGHT, LOW);
  
  Serial.println("Hexagonz lamp module initialized");
}

// Switch lamp on
void switchHexagonzLampOn() {
  hexagonzLampState = true;
  if (!hexagonzBlinkingEnabled) {
    digitalWrite(HEXAGONZ_WHITE_LIGHT, HIGH);
    int pwmValue = map(hexagonzLampBrightness, 0, 100, 0, 255);
    analogWrite(HEXAGONZ_WHITE_LIGHT, pwmValue);
    Serial.println("Hexagonz lamp turned ON");
  }
  controllerAnswer("Hexagonz lamp turned ON");
}

// Switch lamp off
void switchHexagonzLampOff() {
  hexagonzLampState = false;
  pinMode(HEXAGONZ_WHITE_LIGHT, OUTPUT); 
  digitalWrite(HEXAGONZ_WHITE_LIGHT, LOW);
  Serial.println("Hexagonz lamp turned OFF");
  controllerAnswer("Hexagonz lamp turned OFF");
}

// Set lamp brightness
void setHexagonzLampBrightness(int brightness) {
  if (brightness < 0) brightness = 0;
  if (brightness > 100) brightness = 100;
  
  hexagonzLampBrightness = brightness;
  
  // Only apply brightness if lamp is on and not blinking
  if (hexagonzLampState && !hexagonzBlinkingEnabled) {
    // Convert percentage to PWM value (0-255)
    int pwmValue = map(brightness, 0, 100, 0, 255);
    analogWrite(HEXAGONZ_WHITE_LIGHT, pwmValue);
  }
  
  Serial.print("Hexagonz lamp brightness set to: ");
  Serial.println(brightness);
  controllerAnswer("Brightness changed to " + String(brightness));
}

// Set lamp blinking
void setHexagonzLampBlinking(bool shouldBlink, int blinkRate) {
  hexagonzBlinkingEnabled = shouldBlink;
  if (blinkRate > 0) {
    hexagonzBlinkRate = blinkRate;
  }
  
  if (!shouldBlink && hexagonzLampState) {
    // Convert percentage to PWM value (0-255)
    int pwmValue = map(hexagonzLampBrightness, 0, 100, 0, 255);
    analogWrite(HEXAGONZ_WHITE_LIGHT, pwmValue);
  }
  
  Serial.print("Hexagonz lamp blinking set to: ");
  Serial.println(shouldBlink ? "ON" : "OFF");
  controllerAnswer("Blinking mode " + String(shouldBlink ? "enabled" : "disabled"));
}

// Control info LED
void setInfoLedOn() {
  digitalWrite(HEXAGONZ_INFO_LED, HIGH);
}

void setInfoLedOff() {
  digitalWrite(HEXAGONZ_INFO_LED, LOW);
}

bool getInfoLedState() {
  return digitalRead(HEXAGONZ_INFO_LED) == HIGH;
}

void toggleInfoLed() {
  digitalWrite(HEXAGONZ_INFO_LED, !digitalRead(HEXAGONZ_INFO_LED));
}

// Button handling
void checkHexagonzButton() {
  // Read the button state
  bool currentButtonState = !digitalRead(HEXAGONZ_BUTTON); // Button is active LOW with pull-up
  
  // Debounce the button
  if (currentButtonState != buttonPressed) {
    lastButtonDebounceTime = millis();
  }
  
  if ((millis() - lastButtonDebounceTime) > debounceDelay) {
    // If the button state has changed and is stable
    if (currentButtonState != buttonPressed) {
      // If button is newly pressed
      if (currentButtonState) {
        // Store the current LED state before changing it
        previousInfoLedState = getInfoLedState();
        // Turn on the info LED while button is pressed
        setInfoLedOn();
        // Handle lamp toggle
        toggleLampState();
      } else {
        // Button was released, restore previous LED state
        if (previousInfoLedState) {
          setInfoLedOn();
        } else {
          setInfoLedOff();
        }
      }
      
      buttonPressed = currentButtonState;
    }
  }
  
  // Handle blinking if enabled
  if (hexagonzLampState && hexagonzBlinkingEnabled) {
    if (millis() - lastBlinkTime >= hexagonzBlinkRate) {
      lastBlinkTime = millis();
      blinkState = !blinkState;
      digitalWrite(HEXAGONZ_WHITE_LIGHT, blinkState ? HIGH : LOW);
    }
  }
}

// Toggle lamp state
void toggleLampState() {
  Serial.println("Hexagonz button pressed");
  
  // Toggle lamp state
  if (hexagonzLampState) {
    switchHexagonzLampOff();
  } else {
    switchHexagonzLampOn();
  }
  
  // Send MQTT message to notify the server
  controllerAnswer("buttonPressed");
}

// Programming control
bool blockProgramming(String password) {
  String storedPassword = readProgrammingPasswordFromEEPROM(0);
  
  if (storedPassword.length() == 0 || password == storedPassword) {
    // Implement code to block USB programming
    // This is a placeholder and would need hardware-specific implementation
    setInfoLedOn(); // Indicate programming is blocked
    switchHexagonzLampOn(); // Ensure lamp is off when programming is blocked
    Serial.println("Programming blocked");
    controllerAnswer("Programming blocked");
    return true;
  } else {
    Serial.println("Invalid password for blocking programming");
    controllerAnswer("Invalid password");
    return false;
  }
}

bool openProgramming(String password) {
  String storedPassword = readProgrammingPasswordFromEEPROM(0);
  
  if (storedPassword.length() == 0 || password == storedPassword) {
    // Implement code to allow USB programming
    // This is a placeholder and would need hardware-specific implementation
    setInfoLedOff(); // Indicate programming is open
    switchHexagonzLampOff(); // Ensure lamp is off when programming is open
    Serial.println("Programming opened");
    controllerAnswer("Programming opened");
    return true;
  } else {
    Serial.println("Invalid password for opening programming");
    controllerAnswer("Invalid password");
    return false;
  }
}

// Scene recreation
void hexagonzLampScene(String brightness, String blinking, String blinkRate) {
  // Set brightness
  int brightnessValue = brightness.toInt();
  setHexagonzLampBrightness(brightnessValue);
  
  // Set blinking if needed
  bool blinkingValue = (blinking == "1" || blinking == "true");
  int blinkRateValue = blinkRate.toInt();
  setHexagonzLampBlinking(blinkingValue, blinkRateValue);
  
  // Turn on the lamp if brightness > 0
  if (brightnessValue > 0) {
    switchHexagonzLampOn();
  } else {
    switchHexagonzLampOff();
  }
  
  Serial.println("Hexagonz lamp scene restored");
}
