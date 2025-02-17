import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('verseHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const removeHistoryItem = async (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    await AsyncStorage.setItem('verseHistory', JSON.stringify(newHistory));
  };

  const renderHistoryItem = ({ item, index }) => {
    const verseRange = item.startVerse && item.endVerse
      ? `:${item.startVerse}-${item.endVerse}`
      : item.startVerse
        ? `:${item.startVerse}`
        : '';

    const displayText = `${item.book} ${item.chapter}${verseRange}`;

    return (
      <View style={styles.historyItem}>
        <TouchableOpacity
          style={styles.historyText}
          onPress={() => navigation.navigate('Memorization', {
            book: item.book,
            chapter: item.chapter,
            verse: item.verse,
          })}
        >
          <Text>{displayText}</Text>
          <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeHistoryItem(index)} hitSlop={{ top: 10, bottom: 10, left: 15, right: 10 }}>
          <Icon name="close-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('historyPage.recentHistory')}</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noHistoryText}>{t('historyPage.noHistory')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  historyText: {
    flex: 1,
  },
});

export default HistoryScreen;
