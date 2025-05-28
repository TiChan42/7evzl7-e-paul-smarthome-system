#include <WiFi.h>
#include "network_utils.h"
#include "eeprom_utils.h"

int performNetworkScan() {
  Serial.println("Starte WiFi-Scan...");
  WiFi.scanDelete(); // Lösche vorherige Scan-Ergebnisse
  int networkCount = WiFi.scanNetworks(false, true, false, 300); // Async=false, show_hidden=true, passive=false, max_ms_per_chan=300
  
  if (networkCount == WIFI_SCAN_FAILED) {
    Serial.println("WiFi-Scan fehlgeschlagen");
    return 0;
  } else if (networkCount == 0) {
    Serial.println("Keine Netzwerke gefunden");
  } else {
    Serial.printf("Gefundene Netzwerke: %d\n", networkCount);
  }
  
  return networkCount;
}

void validateNetworkData(NetworkInfo& network) {
  // Validiere RSSI-Werte
  if (network.rssi > 0 || network.rssi < -120) {
    network.rssi = -120; // Setze ungültige Werte auf Minimum
  }
}

void filterDuplicateNetworks(NetworkInfo networks[], int count, int& validCount) {
  validCount = 0;
  
  // Duplikate markieren (behalte das stärkste Signal)
  for (int i = 0; i < count; i++) {
    if (networks[i].duplicate) continue;
    if (networks[i].ssid.length() == 0) {
      networks[i].duplicate = true; // Versteckte Netzwerke ohne SSID ausschließen
      continue;
    }
    
    for (int j = i + 1; j < count; j++) {
      if (networks[j].duplicate) continue;
      if (networks[i].ssid.equals(networks[j].ssid)) {
        // Markiere das schwächere Signal als Duplikat
        if (networks[i].rssi >= networks[j].rssi) {
          networks[j].duplicate = true;
        } else {
          networks[i].duplicate = true;
          break;
        }
      }
    }
  }

  // Zähle gültige Netzwerke
  for (int i = 0; i < count; i++) {
    if (!networks[i].duplicate) {
      validCount++;
    }
  }
}

void sortNetworksBySignalStrength(int validIndices[], int count, NetworkInfo networks[]) {
  // Effizientes Sortieren mit Selection Sort
  for (int i = 0; i < count - 1; i++) {
    int maxIndex = i;
    for (int j = i + 1; j < count; j++) {
      if (networks[validIndices[j]].rssi > networks[validIndices[maxIndex]].rssi) {
        maxIndex = j;
      }
    }
    if (maxIndex != i) {
      int temp = validIndices[i];
      validIndices[i] = validIndices[maxIndex];
      validIndices[maxIndex] = temp;
    }
  }
}

int* scanAndSortNetworks(int& networkCount) {
  // Netzwerk-Scan durchführen
  int rawNetworkCount = performNetworkScan();
  if (rawNetworkCount == 0) {
    networkCount = 0;
    return nullptr;
  }

  // Array für Netzwerkinformationen erstellen
  NetworkInfo* networks = new NetworkInfo[rawNetworkCount];
  for (int i = 0; i < rawNetworkCount; i++) {
    networks[i].index = i;
    networks[i].ssid = WiFi.SSID(i);
    networks[i].rssi = WiFi.RSSI(i);
    networks[i].duplicate = false;
    
    validateNetworkData(networks[i]);
  }

  // Duplikate filtern
  int validNetworkCount = 0;
  filterDuplicateNetworks(networks, rawNetworkCount, validNetworkCount);

  if (validNetworkCount == 0) {
    delete[] networks;
    networkCount = 0;
    return nullptr;
  }

  // Array nur mit gültigen Netzwerken erstellen
  int* validIndices = new int[validNetworkCount];
  int validIndex = 0;
  for (int i = 0; i < rawNetworkCount; i++) {
    if (!networks[i].duplicate) {
      validIndices[validIndex++] = i;
    }
  }

  // Nach Signalstärke sortieren
  sortNetworksBySignalStrength(validIndices, validNetworkCount, networks);

  Serial.printf("Gültige Netzwerke nach Filterung: %d\n", validNetworkCount);

  // Aufräumen
  delete[] networks;
  
  networkCount = validNetworkCount;
  return validIndices;
}

// Methode zum Aufbauen einer Verbindung, falls das Netzwerk bekannt ist
bool tryToConnectToWifi(){

  // Adresse des Passworts im EEPROM
  int ssidPasswordAddress = 0;
  
  // Variable die den Verbindungsstatus speichert
  bool connected = false;

  // Variable die überprüft, wie lange der Verbindungsaufbau bereits versucht wurde
  int timeoutCounter;

  // Maximale Anzahl an 0,5ms-Intervallen die es dauern darf, sich zu verbinden
  int maxRetries = 30;

  // Daten zum log in im WLAN aus dem EEPROM lesen
  String ssid = readSSIDFromEEPROM(ssidPasswordAddress);
  String password = readPasswordFromEEPROM(ssidPasswordAddress);

  Serial.println(ssid);
  Serial.println(password);

  // Verbinden mit dem WLAN-Netzwerk
  Serial.println("Try to connect with WiFi: \nSSID: " + ssid + " \nPassword: " + password);
  delay(500);
  
  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.print("Connecting");
  timeoutCounter = 0;
  while ((WiFi.status() != WL_CONNECTED) && (timeoutCounter <= maxRetries)) {
    delay(500);
    Serial.print(".");
    timeoutCounter += 1;
    Serial.print(timeoutCounter);
  }

  // Überprüfen des Verbindungsaufbaus
  if (timeoutCounter <= maxRetries){
    connected = true;
    Serial.println();
    Serial.print("Connected, IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.print("Connection Failed");
  }
  
  Serial.println();
  Serial.println(connected);

  return connected;
}