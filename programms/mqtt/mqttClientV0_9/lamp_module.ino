/*
// Initialisiere Pins für LEDs
#define LED_RED   4
#define LED_GREEN 5
#define LED_BLUE  0
#define LED_WHITE 2

// Definiere Farbkonstanten
#define COLOR_RED 255,0,0
#define COLOR_GREEN 0,255,0
#define COLOR_BLUE 0,0,255
#define COLOR_VIOLET 255,0,255
#define COLOR_YELLOW 255,255,0
#define COLOR_CYAN 0,255,255

// Globale Variablen für aktuelle Farbinformationen und Helligkeit
char global_red=0,global_green=0,global_blue=0,global_brightness=100;
bool white_flag = true;

// Beispiel zum Setzen einer Farbkonstante
// setColor(COLOR_RED);

void setup() {
  // Initialisiere digitale Pins als Ausgänge für LEDs
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);
  pinMode(LED_WHITE, OUTPUT);

  // Schalte alle LEDs aus
  digitalWrite(LED_RED, HIGH);  
  digitalWrite(LED_GREEN, HIGH);  
  digitalWrite(LED_BLUE, HIGH);  
  digitalWrite(LED_WHITE, HIGH);  

}

// Loop-Funktion: Wird kontinuierlich wiederholt
void loop() {

}
*/

// Funktion zur Ansteuerung der RGB-LEDs basierend auf Farb- und Helligkeitsinformationen
void writeColor(char r, char g, char b, char brightness){

  digitalWrite(LED_WHITE, HIGH);  

  if(brightness > 204){
    brightness = 204;
  }
  char red = ((255 - r) * brightness) / 255;
  char green = ((255 - g) * brightness) / 255;
  char blue = ((255 - b) * brightness) / 255;

  
  analogWrite(LED_RED, red);
  analogWrite(LED_GREEN, green);
  analogWrite(LED_BLUE, blue);

  white_flag = false;

  controllerAnswer("Farbe geändert zu: rot: " + String(int(r)) + " grün: " + String(int(g)) + " blau: " + String(int(b))+ " helligkeit: " + String(int(brightness)));
}

// Funktion zum Setzen der Farbkomponenten
void setColor(char r, char g, char b){

  global_red = r;
  global_green = g;
  global_blue = b;
  
  writeColor(r, g, b, global_brightness);
}

// Funktion zur Ansteuerung der Weiß-LED basierend auf Helligkeitsinformationen
void writeWhite(char brightness){
  digitalWrite(LED_RED, HIGH);  
  digitalWrite(LED_GREEN, HIGH);  
  digitalWrite(LED_BLUE, HIGH);  
  
  analogWrite(LED_WHITE, (255 - brightness));

  white_flag = true;
}

// Funktion zum Setzen der Weiß-Helligkeit
void setWhite(char brightness){

  global_brightness = brightness;
  
  writeWhite(brightness);
}

// Funktion zur Setzung der LED-Farbe basierend auf einem Hex-String
//#45FF30
//brauch ich
void setHexColor(String hexString) {

  hexString.replace("#", "");

  if (hexString.length() != 6) {
    Serial.println("Ungültiger Hex-String");
    controllerAnswer("Ungültiger Hex-String");
    return;
  }

  // Extrahiere die rote, grüne und blaue Komponente des Hex-Strings
  char red = strtol(hexString.substring(0, 2).c_str(), NULL, 16);
  char green = strtol(hexString.substring(2, 4).c_str(), NULL, 16);
  char blue = strtol(hexString.substring(4, 6).c_str(), NULL, 16);

  if (red == green && red == blue) {
    char brightness = global_brightness;
    setWhite(red);
    global_brightness = brightness;
  } else {
    setColor(red, green, blue);
  }
}

// Funktion zum Setzen der Farbkomponenten und Helligkeit
//aktuelle werte plat machen, neu setzen
void setRGBA(char r, char g, char b, char brightness){

  global_red = r;
  global_green = g;
  global_blue = b;
  global_brightness = brightness;
  
  writeColor(r, g, b, brightness);
}

// Funktion zum Setzen der Helligkeit
void setBrightness(char brightness){
  if(white_flag){
    setWhite(brightness);
  } else {
    setRGBA(global_red, global_green, global_blue, brightness);
  }
  
  Serial.println(String(int(brightness)));
  controllerAnswer("helligkeit geändert zu: " + String(int(brightness)));
}

//brauch ich 
// Funktion zum Ändern der Helligkeit (erhöht)
void changeBrightness(int changeValue){
  if (changeValue > 255) changeValue = 255;
  if (changeValue < -255) changeValue = -255;

  int borderCheck = ((int)global_brightness) + changeValue;
  if (borderCheck < 0) borderCheck = 0;
  if (borderCheck > 255) borderCheck = 255;
  setBrightness(((char)borderCheck));
}







