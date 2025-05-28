#ifndef NETWORK_UTILS_H
#define NETWORK_UTILS_H

struct NetworkInfo {
  int index;
  String ssid;
  int rssi;
  bool duplicate;
};

// Main function to scan and sort networks
bool tryToConnectToWifi();
int* scanAndSortNetworks(int& networkCount);

// Individual utility functions
int performNetworkScan();
void filterDuplicateNetworks(NetworkInfo networks[], int count, int& validCount);
void sortNetworksBySignalStrength(int validIndices[], int count, NetworkInfo networks[]);
void validateNetworkData(NetworkInfo& network);

#endif // NETWORK_UTILS_H
