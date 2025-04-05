import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QRScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert(
      "Gavekort Scannet",
      `Vil du tilføje dette gavekort?\n\nData: ${data}`,
      [
        {
          text: "Nej",
          style: "cancel",
          onPress: () => setScanned(false)
        },
        {
          text: "Ja",
          onPress: () => saveGiftCard(data)
        }
      ]
    );
  };

  const saveGiftCard = async (cardData: string) => {
    try {
      const [store, amount] = cardData.split(':');
      const existingCards = await AsyncStorage.getItem('giftCards');
      const cards = existingCards ? JSON.parse(existingCards) : [];
      
      const newCard = {
        id: Date.now().toString(),
        store: store || 'Ukendt butik',
        amount: amount || '0',
        dateAdded: new Date().toISOString(),
      };
      
      cards.push(newCard);
      await AsyncStorage.setItem('giftCards', JSON.stringify(cards));
      
      Alert.alert(
        "Success",
        "Gavekortet er blevet tilføjet!",
        [{ text: "OK", onPress: () => router.push("/(tabs)") }]
      );
    } catch (error) {
      Alert.alert("Fejl", "Kunne ikke gemme gavekortet");
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        type="back"
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.scanArea}>
            <Text style={styles.scanText}>Placér QR-koden i midten</Text>
          </View>
        </View>
      </Camera>
      {scanned && (
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Scan igen</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 44,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 8,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});