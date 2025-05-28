#ifndef LAMP_MODULE_H
#define LAMP_MODULE_H

// Function declarations for lamp module
void writeColor(char r, char g, char b, char brightness);
void setColor(char r, char g, char b);
void writeWhite(char brightness);
void setWhite(char brightness);
void setHexColor(String hexString);
void setRGBA(char r, char g, char b, char brightness);
void setBrightness(char brightness);
void changeBrightness(int changeValue);
void switchLampOff();
void switchLampOn();
void lampScene(String whiteFlag, String red, String green, String blue, String brightness);

#endif // LAMP_MODULE_H
