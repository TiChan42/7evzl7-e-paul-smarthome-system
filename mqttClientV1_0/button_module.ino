//Definition der Ports
/*
#define ONBOARD_LED 2          
#define BUTTON      0   

//Standartmäßiges setzen der Flags (Standart-Modus: Schalter)
bool state = 0;
bool testState = 1;
bool mode = 0;
bool showStateOnLED = 1;

//Initialisierung der Pins
void setup() {
  pinMode(ONBOARD_LED, OUTPUT);
  pinMode(BUTTON, INPUT);  
  digitalWrite(ONBOARD_LED, HIGH);
}

//überprüfen des Knopfes
void loop() {
  checkButton();
}
*/

void controllerAnswer(String answer);

//Überprüft den Knopf und führt bei änderung die dem Modus entsprechende Aktion aus
void checkButton(){
  bool actualButtonstate =digitalRead(BUTTON);
  if(actualButtonstate != testState){
    testState = actualButtonstate;
    //Button: ändert State je nach ist-Wert
    if(mode){
      state = !actualButtonstate;
      writeLED(state);
      if(state) sendButtonPressed();
      else sendButtonReleased();
    }
    
    //Latch: ändert State bei Pusitiver Flanke
    else if(!actualButtonstate){ 
      state = !state;
      writeLED(state);
      if(state) sendButtonPressed();
      else sendButtonReleased();
    }
    delay(100); // zum entprellen
  }
}
//schreibt die LED auf ledState wenn der Status über Led angezeigt werden soll
void writeLED(bool ledState){
  if(showStateOnLED){
    digitalWrite(ONBOARD_LED, !ledState);
  }
}

//###############################
//@Mathi Die Methoden brauchst du
//###############################



//Resettet den Status des Moduls und Setzt den Knopf-Modus
void setButtonMode(){
  mode = 1;
  state = 0;
  testState = 1;
}

//Resettet den Status des Moduls und Setzt den Schalter-Modus
void setLatchMode(){
  mode = 0;
  state = 0;
  testState = 1;
}

void switchButtonOff(){
  state = 0;
  controllerAnswer("Der Knopf wurde ausgeschalten");
}

void switchButtonOn(){
  state = 1;
  controllerAnswer("Der Knopf wurde eingeschalten");  
}

//das auch
//Setzt die Flag dass der Status des Schalters an der LED angezeigt werden soll
void setShowState(){
  showStateOnLED = 1;
}

//??? das noch als ausführbarer befehl
//Setzt die Flag zurrück, dass der Status des Schalters an der LED angezeigt werden soll
void removeShowState(){
  showStateOnLED = 0;
}


//???
//Sendet Aktuellen Modus
void sendCurrentMode(){
  //Mathi dein Code
  if(mode){
    //Button Mode
  }else{
    //Latch Mode
  }
}

//Sendet dass der Status auf gedrückt gesetzt wurde
void sendButtonPressed(){
  controllerAnswer("Der Knopf wurde gedrückt");
  Serial.println("Der Knopf wurde gedrückt!");
}

//Sendet dass der Status auf losgelassen gesetzt wurde
void sendButtonReleased(){
  controllerAnswer("Der Knopf wurde logelassen");
  Serial.println("Der Knopf wurde losgelassen!");
  
}

void switchButtonMode(){
  if(mode) setLatchMode();
  else setButtonMode();
  controllerAnswer("Der Modus des Knopfs wurde geändert");
}

void buttonScene(String sceneState, String sceneTestState, String sceneMode, String sceneShowStateOnLED){
  bool state = sceneState.toInt();
  bool testState = sceneTestState.toInt();
  bool mode = sceneMode.toInt();
  bool showStateOnLED = sceneShowStateOnLED.toInt();

}
