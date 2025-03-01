import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MaterialIcons } from "@expo/vector-icons";

const QRScreen = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = () => {
    Alert.alert(
      "Kameratilladelse",
      "Vil du give appen adgang til dit kamera?",
      [
        {
          text: "Nej",
          onPress: () => router.back(),
          style: "cancel"
        },
        {
          text: "Ja",
          onPress: () => setHasPermission(true)
        }
      ]
    );
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Start Scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.text}>Scanner aktiveret!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRScreen; 