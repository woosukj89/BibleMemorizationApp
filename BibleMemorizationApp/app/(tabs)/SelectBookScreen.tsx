import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { bibleData } from '@/utils/bibleData';
import { saveToHistory } from '@/utils/history';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
  SelectBook: undefined;
  SelectChapter: { book: string };
  Memorization: { book: string; chapter: number; fromChapter: boolean };
};

type SelectBookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectBook'>;

interface SelectBookScreenProps {
  navigation: SelectBookScreenNavigationProp;
}

const SelectBookScreen: React.FC<SelectBookScreenProps> = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const { t } = useTranslation();

  const renderBookSelection = () => (
    <>
      <Text style={styles.title}>{t('selectChapterPage.selectBook')}</Text>
      {Object.keys(bibleData).map(book => (
        <TouchableOpacity
          key={book}
          style={styles.button}
          onPress={() => setSelectedBook(book)}
        >
          <Text style={styles.buttonText}>{book}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  const renderChapterSelection = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => setSelectedBook(null)}>
        <Text style={styles.backButtonText}>{t('selectChapterPage.backToBooks')}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t('selectChapterPage.selectChapterFrom', { book: selectedBook })}</Text>
      {Object.keys(bibleData[selectedBook!]).map(chapter => (
        <TouchableOpacity
          key={chapter}
          style={styles.button}
          onPress={() => {
            navigation.navigate('Memorization', { book: selectedBook!, chapter: parseInt(chapter), fromChapter: true });
            saveToHistory(selectedBook!, parseInt(chapter))
          }}
        >
          <Text style={styles.buttonText}>{t('selectChapterPage.chapter', { chapter: chapter })}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <ScrollView style={styles.container}>
      {selectedBook ? renderChapterSelection() : renderBookSelection()}
    </ScrollView>
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
  button: {
    backgroundColor: '#78A2CC',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
});

export default SelectBookScreen;
