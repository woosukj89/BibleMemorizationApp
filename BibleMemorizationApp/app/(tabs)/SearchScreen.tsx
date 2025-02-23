import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveToHistory } from '@/utils/history';
import { useTranslation } from 'react-i18next';
import { getBooks, getChapters, getLastVerseNumber, getVerseNumbers } from '@/db/databaseService';
import GenericSelectionModal from '@/components/GenericSelectionModal';
import HorizontalSelectionModal from '@/components/HorizontalSelectionModal';

const SearchScreen = ({ navigation }) => {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [startVerse, setStartVerse] = useState(0);
  const [endVerse, setEndVerse] = useState(0);
  const [errors, setErrors] = useState({ book: false, chapter: false, verse: false });
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [chapterModalVisible, setChapterModalVisible] = useState(false);
  const [startVerseModalVisible, setStartVerseModalVisible] = useState(false);
  const [endVerseModalVisible, setEndVerseModalVisible] = useState(false);
  const { t } = useTranslation();

  const books = getBooks();
  const chapters = selectedBook ? getChapters(selectedBook) : [];
  const verses = selectedChapter ? getVerseNumbers(selectedBook, selectedChapter) : [];
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
      const lastVerse = endVerse ? endVerse : startVerse;
      navigation.navigate('Memorization', {
        book: selectedBook,
        chapter: selectedChapter,
        verse: startVerse,
        endVerse: lastVerse,
        fromSearch: true,
      });
      saveToHistory(selectedBook, selectedChapter, startVerse, lastVerse);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t('searchPage.book') + ':'}</Text>
      <Animated.View style={{ transform: [{ translateX: bookRef.current }] }}>
        <TouchableOpacity 
          style={[styles.picker, errors.book && styles.errorPicker]} 
          onPress={() => setBookModalVisible(true)}
        >
          <Text style={styles.pickerText}>{selectedBook ? t(`bible.${selectedBook}`) : t('searchPage.selectBook')}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.label}>{t('searchPage.chapter') + ':'}</Text>
      <Animated.View style={{ transform: [{ translateX: chapterRef.current }] }}>
        <TouchableOpacity 
          style={[styles.picker, !!selectedBook && errors.chapter && styles.errorPicker]} 
          onPress={() => setChapterModalVisible(true)}
          disabled={!selectedBook}
        >
          <Text style={[styles.pickerText, !selectedBook && styles.pickerDisabled]}>{selectedChapter ? selectedChapter : t('searchPage.selectChapter')}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateX: verseRef.current }] }}>
      <Text style={styles.label}>{t('searchPage.startVerse') + ':'}</Text>
        <TouchableOpacity 
          style={[styles.picker, !!selectedChapter && errors.verse && styles.errorPicker]} 
          onPress={() => setStartVerseModalVisible(true)}
          disabled={!selectedChapter}
        >
          <Text style={[styles.pickerText, !selectedChapter && styles.pickerDisabled]}>
            {startVerse ? startVerse : t('searchPage.selectStartVerse')}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.label}>{t('searchPage.endVerse') + ':'}</Text>
        <TouchableOpacity 
          style={styles.picker} 
          onPress={() => setEndVerseModalVisible(true)}
          disabled={!startVerse || startVerse >= verses.length}
        >
          <Text style={[styles.pickerText, (!startVerse || startVerse >= verses.length) && styles.pickerDisabled]}>
            {endVerse ? endVerse : t('searchPage.selectEndVerse')}</Text>
        </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{t('searchPage.search')}</Text>
      </TouchableOpacity>

      <GenericSelectionModal
        visible={bookModalVisible}
        onClose={() => setBookModalVisible(false)}
        onSelect={(book: string) => {
          setSelectedBook(book);
          setSelectedChapter(0);
          setStartVerse(0);
          setEndVerse(0);
          setErrors({ ...errors, book: false, chapter: false, verse: false });
        }}
        values={books}
        t={t}
        getLabel={(book: string) => t(`bible.${book}`)}
        headerLabels={[t('searchPage.oldTestament'), t('searchPage.newTestament')]}
        maxPerColumn={39}
        title={t('searchPage.selectBook')}
      />
      <HorizontalSelectionModal
        visible={chapterModalVisible}
        onClose={() => setChapterModalVisible(false)}
        onSelect={(chapter: number) => {
          setSelectedChapter(chapter);
          setStartVerse(0);
          setEndVerse(0);
          setErrors({ ...errors, chapter: false, verse: false });
        }}
        values={chapters}
        getLabel={(chapter: number) => chapter.toString()}
        title={t('searchPage.selectChapter')}
      />
      <HorizontalSelectionModal
        visible={startVerseModalVisible}
        onClose={() => setStartVerseModalVisible(false)}
        onSelect={(verse: number) => {
          setStartVerse(verse);
          setErrors({ ...errors, verse: false });
        }}
        values={verses}
        getLabel={(verse: number) => verse.toString()}
        title={t('searchPage.selectStartVerse')}
      />
      <HorizontalSelectionModal
        visible={endVerseModalVisible}
        onClose={() => setEndVerseModalVisible(false)}
        onSelect={(verse: number) => {
          setEndVerse(verse);
        }}
        values={verses.filter((v) => v! > startVerse)}
        getLabel={(verse: number) => verse.toString()}
        title={t('searchPage.selectEndVerse')}
      />
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
    backgroundColor: '#BFA58A',
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
    marginVertical: 5,
    padding: 15,
  },
  pickerText: {
    fontSize: 16,
  },
  pickerDisabled: {
    color: '#ccc'
  },
  errorPicker: {
    backgroundColor: '#FF6B6B',
  },
});

export default SearchScreen;
