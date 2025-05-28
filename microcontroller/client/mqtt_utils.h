#ifndef MQTT_UTILS_H
#define MQTT_UTILS_H

// MQTT utility functions
void controllerAnswer(String answer);
bool mqttJsonInterpretation(String mqttJsonSignal);
void reconnect();

#endif // MQTT_UTILS_H