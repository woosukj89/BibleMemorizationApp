import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { bibleData, getLastVerse } from '@/utils/bibleData';
import { saveToHistory } from '@/utils/history';
import { useTranslation } from 'react-i18next';

const SearchScreen = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [errors, setErrors] = useState({ book: false, chapter: false, verse: false });
  const { t } = useTranslation();

  const books = Object.keys(bibleData);
  const chapters = selectedBook ? Object.keys(bibleData[selectedBook]) : [];
  const verses = selectedChapter ? [...Array(bibleData[selectedBook][selectedChapter].length).keys()].map(i => i + 1) : [];
  const bookRef = useRef(new Animated.Value(0));
  const chapterRef = useRef(new Animated.Value(0));
  const verseRef = useRef(new Animated.Value(0));

  const shakeAnimation = (ref) => {
    Animated.sequence([
        Animated.timing(ref.current, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(ref.current, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(ref.current, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(ref.current, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };


  const handleSearch = () => {
    const newErrors = {
      book: !selectedBook,
      chapter: !!selectedBook && !selectedChapter,
      verse: !!selectedBook && !!selectedChapter && !startVerse
    };
    setErrors(newErrors);

    if (!selectedBook) shakeAnimation(bookRef);
    if (selectedBook && !selectedChapter) shakeAnimation(chapterRef);
    if (selectedBook && selectedChapter && !startVerse) shakeAnimation(verseRef);

    if (selectedBook && selectedChapter && startVerse) {
      const lastVerse = endVerse ? parseInt(endVerse) : getLastVerse(selectedBook, selectedChapter);
      navigation.navigate('Memorization', {
        book: selectedBook,
        chapter: selectedChapter,
        verse: parseInt(startVerse),
        endVerse: lastVerse,
        fromSearch: true,
      });
      saveToHistory(selectedBook, selectedChapter, parseInt(startVerse), lastVerse);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t('searchPage.book') + ':'}</Text>
      <Animated.View style={{ transform: [{ translateX: bookRef.current }] }}>
        <Picker
          selectedValue={selectedBook}
          onValueChange={(itemValue) => {
            setSelectedBook(itemValue);
            setSelectedChapter(0);
            setStartVerse('');
            setEndVerse('');
            setErrors({ ...errors, book: false, chapter: false, verse: false });
          }}
          style={[styles.picker, errors.book && styles.errorPicker]}
        >
          <Picker.Item label={t('searchPage.selectBook')} value="" />
          {books.map((book) => (
            <Picker.Item key={book} label={book} value={book} />
          ))}
        </Picker>
      </Animated.View>

      <Text style={styles.label}>{t('searchPage.chapter') + ':'}</Text>
      <Animated.View style={{ transform: [{ translateX: chapterRef.current }] }}>
        <Picker
          selectedValue={selectedChapter}
          onValueChange={(itemValue) => {
              setSelectedChapter(itemValue);
              setStartVerse('');
              setEndVerse('');
              setErrors({ ...errors, chapter: false, verse: false });
          }}
          enabled={!!selectedBook}
          style={[styles.picker, !!selectedBook && errors.chapter && styles.errorPicker]}
        >
          <Picker.Item label={t('searchPage.selectChapter')} value="" />
          {chapters.map((chapter) => (
            <Picker.Item key={chapter} label={chapter} value={chapter} />
          ))}
        </Picker>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateX: verseRef.current }] }}>
      <Text style={styles.label}>{t('searchPage.startVerse') + ':'}</Text>
      <Picker
        selectedValue={startVerse}
        onValueChange={(itemValue) => {
            setStartVerse(itemValue);
            setEndVerse('');
            setErrors({ ...errors, verse: false });
        }}
        enabled={!!selectedChapter}
        style={[styles.picker, !!selectedChapter && errors.verse && styles.errorPicker]}
      >
        <Picker.Item label={t('searchPage.selectStartVerse')} value="" />
        {verses.map((verse) => (
          <Picker.Item key={verse} label={verse.toString()} value={verse.toString()} />
        ))}
      </Picker>
      </Animated.View>

      <Text style={styles.label}>{t('searchPage.endVerse') + ':'}</Text>
      <Picker
        selectedValue={endVerse}
        onValueChange={(itemValue) => setEndVerse(itemValue)}
        enabled={!!startVerse}
      >
        <Picker.Item label={t('searchPage.selectEndVerse')} value="" />
        {verses.filter((v) => v >= parseInt(startVerse)).map((verse) => (
          <Picker.Item key={verse} label={verse.toString()} value={verse.toString()} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{t('searchPage.search')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  errorPicker: {
    backgroundColor: '#FF6B6B',
  },
});

export default SearchScreen;
