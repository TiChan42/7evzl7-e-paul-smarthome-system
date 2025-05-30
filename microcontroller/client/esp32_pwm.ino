#include <Arduino.h>

// External LED pin variables declared in client.ino
extern uint8_t LED_RED, LED_GREEN, LED_BLUE, LED_WHITE;

// PWM properties
#define PWM_FREQ 5000
#define PWM_RESOLUTION 8  // 8-bit resolution (0-255)

// This function sets up PWM for ESP32 pins
void setupPWM() {
  ledcAttach(LED_RED, PWM_FREQ, PWM_RESOLUTION);
  ledcAttach(LED_GREEN, PWM_FREQ, PWM_RESOLUTION);
  ledcAttach(LED_BLUE, PWM_FREQ, PWM_RESOLUTION);
  ledcAttach(LED_WHITE, PWM_FREQ, PWM_RESOLUTION);
}

// ESP32 replacement for analogWrite
void analogWrite(uint8_t pin, uint8_t value) {
  ledcWrite(pin, value);
}
