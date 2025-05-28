#ifndef ESP32_PWM_H
#define ESP32_PWM_H

#include <Arduino.h>

// PWM property definitions
#define PWM_FREQ 5000
#define PWM_RESOLUTION 8  // 8-bit resolution (0-255)

// Function declarations for ESP32 PWM utilities
void setupPWM();
void analogWrite(uint8_t pin, uint8_t value);

#endif // ESP32_PWM_H
