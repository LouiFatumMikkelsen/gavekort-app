import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Animated, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GiftCard {
  id: string;
  store: string;
  amount: string;
  expiryDate: Date;
  cardNumber: string;
}

// Tilføj en funktion til at generere forskellige farver baseret på butiksnavn
const getCardColor = (storeName: string) => {
  const colors = [
    '#1e3a8a', // Mørkeblå
    '#047857', // Mørkegrøn
    '#7c3aed', // Lilla
    '#b91c1c', // Mørkerød
    '#0369a1', // Ocean blå
  ];
  
  // Brug butiksnavn til at vælge en farve
  const index = storeName.length % colors.length;
  return colors[index];
};

export default function MineKortScreen() {
  const router = useRouter();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);

  const loadGiftCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('giftCards');
      console.log('Indlæste kort:', savedCards);
      if (savedCards) {
        const cards = JSON.parse(savedCards);
        setGiftCards(cards);
        console.log('Kort sat i state:', cards);
      }
    } catch (error) {
      console.error('Fejl ved indlæsning af gavekort:', error);
    }
  };

  const checkStorage = async () => {
    const savedCards = await AsyncStorage.getItem('giftCards');
    console.log('Gemte kort:', savedCards);
  };

  useFocusEffect(
    useCallback(() => {
      loadGiftCards();
      checkStorage();
    }, [])
  );

  const deleteCard = async (cardId: string) => {
    Alert.alert(
      "Slet gavekort",
      "Er du sikker på, at du vil slette dette gavekort?",
      [
        { text: "Annuller" },
        {
          text: "Slet",
          style: "destructive",
          onPress: async () => {
            try {
              // Opdater state først
              const newCards = giftCards.filter(card => card.id !== cardId);
              setGiftCards(newCards);
              
              // Gem til storage bagefter
              await AsyncStorage.setItem('giftCards', JSON.stringify(newCards));
              
              // Vis bekræftelse
              Alert.alert("Gavekort slettet");
            } catch (error) {
              Alert.alert("Fejl", "Kunne ikke slette gavekortet");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Mine Gavekort</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/scan/manual")}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.addButtonText}>Tilføj manuelt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanButton} onPress={() => router.push("/scan/qr")}>
            <Ionicons name="scan" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Scan kort</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.cardList} contentContainerStyle={styles.scrollContent}>
        {giftCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Ingen gavekort endnu</Text>
            <Text style={styles.emptyText}>
              Tilføj dit første gavekort ved at scanne{'\n'}eller indtaste det manuelt
            </Text>
          </View>
        ) : (
          <View style={styles.cardGrid}>
            {giftCards.map((card) => (
              <TouchableOpacity 
                key={card.id} 
                style={[styles.card, { backgroundColor: getCardColor(card.store) }]}
                onPress={() => router.push(`/card/${card.id}`)}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.storeName} numberOfLines={1}>
                    {card.store}
                  </Text>
                </View>
                <View style={styles.cardBottom}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.amount}>{card.amount} kr</Text>
                    <Text style={styles.expiryDate} numberOfLines={1}>
                      Udløber {new Date(card.expiryDate).toLocaleDateString('da-DK')}
                    </Text>
                  </View>
                  <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                </View>
                <View style={styles.cardShine} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    flex: 1,
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    flex: 1,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  cardList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTop: {
    flex: 1,
    padding: 16,
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ skewY: '-10deg' }],
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardBottom: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
  },
  cardInfo: {
    gap: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  expiryDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  cardNumber: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginTop: 8,
  },
});
