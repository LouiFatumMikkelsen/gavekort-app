import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManualEntryScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    store: '',
    amount: '',
    expiryDate: new Date(),
    cardNumber: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validér input
      if (!formData.store || !formData.amount || !formData.cardNumber) {
        Alert.alert('Fejl', 'Udfyld venligst alle felter');
        return;
      }

      const newCard = {
        id: Date.now().toString(),
        store: formData.store,
        amount: formData.amount,
        expiryDate: formData.expiryDate.toISOString(), // Konverter til string
        cardNumber: formData.cardNumber
      };

      // Hent eksisterende kort
      const savedCards = await AsyncStorage.getItem('giftCards');
      const existingCards = savedCards ? JSON.parse(savedCards) : [];
      
      const updatedCards = [...existingCards, newCard];
      await AsyncStorage.setItem('giftCards', JSON.stringify(updatedCards));
      
      console.log('Kort gemt:', newCard);
      console.log('Alle kort:', updatedCards);
      
      Alert.alert('Success', 'Gavekortet er gemt', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Fejl ved gemning:', error);
      Alert.alert('Fejl', 'Kunne ikke gemme gavekortet');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, expiryDate: selectedDate }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Tilføj Gavekort</Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Butik</Text>
          <TextInput
            style={styles.input}
            value={formData.store}
            onChangeText={(text) => setFormData(prev => ({ ...prev, store: text }))}
            placeholder="Indtast butikkens navn"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Beløb</Text>
          <TextInput
            style={styles.input}
            value={formData.amount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
            placeholder="Indtast beløb"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Udløbsdato</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.expiryDate.toLocaleDateString('da-DK')}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.expiryDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
            locale="da-DK"
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kortnummer</Text>
          <TextInput
            style={styles.input}
            value={formData.cardNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, cardNumber: text }))}
            placeholder="Indtast kortnummer"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Gem Gavekort</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 